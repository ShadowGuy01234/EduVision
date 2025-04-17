import Fluvio, {TopicProducer} from '@fluvio/client';
import express, { RequestHandler } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.json({ limit: '10mb' })); // allow large base64 strings

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

const run = async () => {
  const fluvio = new Fluvio();
  await fluvio.connect();
  const producer = await fluvio.topicProducer('screen-stream');

  const sendHandler: RequestHandler = async (req, res) => {
    const { base64Data } = req.body;

    if (!base64Data) {
      res.status(400).json({ error: 'base64Data field missing' });
      return;
    }

    try {
      await producer.send('', base64Data);
      console.log('✅ Data sent to Fluvio topic');
      res.status(200).json({ message: 'Data sent to Fluvio' });
    } catch (err) {
      console.error('❌ Error sending to Fluvio:', err);
      res.status(500).json({ error: 'Failed to send to Fluvio' });
    }
  };

  app.post('/send', sendHandler);

  app.listen(port, () => {
    console.log(`🚀 Producer server running at http://localhost:${port}`);
  });
};

run().catch((err) => {
  console.error('❌ Failed to start producer:', err);
});
