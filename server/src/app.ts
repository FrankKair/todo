import express from 'express';
import cors from 'cors';
import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { UserRoutes, BoardRoutes, TodoRoutes } from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', UserRoutes);
app.use('/api/boards', BoardRoutes);
app.use('/api/todos', TodoRoutes);

AppDataSource.initialize().then(() => {
  app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
  });
}).catch(error => console.log(error));