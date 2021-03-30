/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { NextFunction, Request, Response } from 'express'
import logger from './logger'

const requestLogger = (req: Request, _: Response, next: NextFunction) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (_: Request, res: Response) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error: Error, _: Request, res: Response, next: NextFunction) => {

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  }
  if (error.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'unauthorized' })
  }

  logger.error(error.message)

  next(error)
  return
}

export default {
  requestLogger,
  unknownEndpoint,
  errorHandler
}