/* eslint max-len:0 */

import {describe, it} from 'mocha';
import {expect} from 'chai';
import LokkaHTTPTransport from '../';
import Schema from './sample_schema';
import express from 'express';
import expressGraphql from 'express-graphql';
import {promisify} from 'bluebird';
import {findAPortNotInUse} from 'portscanner';
const pickPort = () => promisify(findAPortNotInUse)(10000, 50000, '127.0.0.1');

describe('LokkaHTTPTransport', () => {
  it('should be able to require normally', () => {
    expect(require('../').Transport).to.be.equal(LokkaHTTPTransport);
  });

  describe('constructor()', () => {
    describe('without an endpoint', () => {
      it('should throw an error', () => {
        expect(() => new LokkaHTTPTransport()).to.throw(/endpoint is required!/);
      });
    });

    describe('with an endpoint', () => {
      it('should create an instance', () => {
        const transport = new LokkaHTTPTransport('/graphql');
        expect(transport.endpoint).to.be.equal('/graphql');
      });
    });
  });

  describe('_buildOptions', () => {
    it('should get the default options', () => {
      const transport = new LokkaHTTPTransport('/');
      const options = transport._buildOptions({aa: 10});

      expect(options).to.deep.equal({
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({aa: 10}),
        credentials: 'include',
        mode: 'cors',
      });
    });

    it('should add custom headers', () => {
      const customOptions = {
        headers: {
          bb: 'hello'
        },
      };
      const transport = new LokkaHTTPTransport('/', customOptions);
      const options = transport._buildOptions({aa: 10});

      expect(options).to.deep.equal({
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          bb: 'hello'
        },
        body: JSON.stringify({aa: 10}),
        credentials: 'include',
        mode: 'cors',
      });
    });

    it('should add custom mode', () => {
      const customOptions = {
        mode: 'no-cors',
      };
      const transport = new LokkaHTTPTransport('/', customOptions);
      const options = transport._buildOptions({mode: 'same-origin'});

      expect(options).to.deep.equal({
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({mode: 'same-origin'}),
        credentials: 'include',
        mode: 'no-cors',
      });
    });

    describe('with unknown mode option', () => {
      it('should throw error', () => {
        expect(() => new LokkaHTTPTransport('/graphql', {mode: 'my-mode'})).to.throw('unknown mode: my-mode');
      });
    });
  });

  describe('send()', () => {
    describe('with a correct graphql query', () => {
      it('should return the result', async () => {
        const app = express();
        app.use('/graphql', expressGraphql({schema: Schema}));
        const port = await pickPort();
        await promisify(app.listen.bind(app))(port);

        const transport = new LokkaHTTPTransport(`http://localhost:${port}/graphql`);
        const result = await transport.send(`
          {
            echo(message: "Hello")
          }
        `);

        expect(result).to.be.deep.equal({
          echo: 'Echo: Hello'
        });
      });
    });

    describe('with an incorrect graphql query', () => {
      it('should return the error', async () => {
        const app = express();
        app.use('/graphql', expressGraphql({schema: Schema}));
        const port = await pickPort();
        await promisify(app.listen.bind(app))(port);

        const transport = new LokkaHTTPTransport(`http://localhost:${port}/graphql`);
        try {
          await transport.send(`
            {
              echo(messa: "Hello")
            }
          `);
          throw new Error('Some Other Error');
        } catch (err) {
          expect(err.message).to.match(/GraphQL Error:/);
          expect(err.rawError).to.be.instanceOf(Array);
        }
      });
    });

    describe('with an invalid status code', () => {
      it('should return the error', async () => {
        const app = express();
        const port = await pickPort();
        await promisify(app.listen.bind(app))(port);

        const transport = new LokkaHTTPTransport(`http://localhost:${port}/graphql`);
        try {
          await transport.send(`
            {
              echo(messa: "Hello")
            }
          `);
          throw new Error('Some Other Error');
        } catch (err) {
          expect(err.message).to.match(/Invalid status code: 404/);
        }
      });
    });
  });
});
