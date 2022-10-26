// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as express from 'express';
import { ServerConfigModel } from '../models/configModel';
import { getClientConfig } from '../utils/getConfig';

const bookingsLinkCacheKey = 'vvBookingsLink';
const DUMMY_BOOKINGS_LINK = 'https://microsoftbookings.azurewebsites.net/?organization=healthcare&UICulture=en-US';

export const configController = (config: ServerConfigModel, cache) => {
  return async (_req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    let clientConfig;

    try {
      clientConfig = getClientConfig(config);
      clientConfig.microsoftBookingsUrl = cache.get(bookingsLinkCacheKey) ?? clientConfig.microsoftBookingsUrl;
    } catch (error) {
      return next(error);
    }

    res.status(200).json(clientConfig);
  };
};

export const updateConfig = (config: ServerConfigModel, cache) => {
  return async (_req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    let clientConfig;

    try {
      cache.set(bookingsLinkCacheKey, DUMMY_BOOKINGS_LINK);
      clientConfig = getClientConfig(config);
      clientConfig.microsoftBookingsUrl = DUMMY_BOOKINGS_LINK;
    } catch (error) {
      return next(error);
    }

    res.status(200).json(clientConfig);
  };
};

export const restoreConfig = (config: ServerConfigModel, cache) => {
  return async (_req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    let clientConfig;

    try {
      cache.del(bookingsLinkCacheKey);
      clientConfig = getClientConfig(config);
    } catch (error) {
      return next(error);
    }

    res.status(200).json(clientConfig);
  };
};
