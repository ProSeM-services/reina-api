import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from './database.config';
import { Payment } from 'src/payment/schema/payment.model';
import { Event } from 'src/event/schema/event.model';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      let config: string;
      switch (process.env.NODE_ENV) {
        case 'development':
          config = databaseConfig.development;
          break;
        case 'test':
          config = databaseConfig.test;
          break;
        case 'production':
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(process.env.DB_DEV_URL, {
        dialect: 'postgres',
        logging: false,
      });
      sequelize.addModels([Event, Payment]);

      Event.hasMany(Payment);
      Payment.belongsTo(Event);

      await sequelize.sync({ alter: true });
      return sequelize;
    },
  },
];
