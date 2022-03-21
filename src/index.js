const path = require('path');
const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'app',
  // brokers: ['localhost:9093'], // when app is running on localhost
  brokers: ['kafka:9092']
});

const consumer = kafka.consumer({ groupId: 'kafka-js-test' });

async function processMessage() {
  await consumer.connect()
  await consumer.subscribe({ topic: 'kafka-js', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        value: message.value.toString(),
      })
    },
  });
};

const producer = kafka.producer();

async function sendMessage(msg) {
  await producer.connect();
  await producer.send({
    topic: 'kafka-js',
    messages: [
      { value: msg },
    ],
  });
  await producer.disconnect();
};

const server = require('express');
const app = server();

const appPort = process.env.PORT || 4000;
const root = path.join(__dirname);

app.use(server.static(root));
app.set('views', root);
app.set('view engine', 'html');
app.use(server.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile('home.html', { root: root  });
});

app.post('/:message', (req, res) => {
  sendMessage(req.params.message || 'no message sent');
  res.sendStatus(200);
});

app.listen(appPort, () => {
    processMessage();
});

