import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import App from '../src/App';

chai.use(chaiHttp);
const expect = chai.expect;
const app = new App().server;

describe('Hello World Base Route', () => {

    it('should be json', () => {
        return chai.request(app).get('/')
            .then(res => {
                expect(res.type).to.eql('application/json');
            });
    });

    it('should have a message prop', () => {
        return chai.request(app).get('/echo/HelloWorld')
            .then(res => {
                expect(res.body.message).to.eql('HelloWorld');
            });
    });

});