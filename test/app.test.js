const supertest = require('supertest');
const app = require('../app.js');
const { expect } = require('chai');

describe('GET /apps', () => {
  it('should return an array of apps', () => {
    return supertest(app).get('/apps')
      .expect(200).expect('Content-Type', /json/)
      .then(res => { 
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.lengthOf.at.least(1);
        const app = res.body[0];
        expect(app).to.include.all.keys( 'App', 'Rating', 'Genres' );    
      });
  });
  it('should be 400 if sort choice is incorrect', () => {
    return supertest(app).get('/apps').query({ sort: 'MISTAKE' })
      .expect(400, 'Sort parameter must be either rating or app');
  });
  it('should sort the list by rating', () => {
    return supertest(app).get('/apps').query({ sort: 'Rating' })
      .expect(200).expect('Content-Type', /json/)
      .then(res => {
        expect(res.body).to.be.an('array');
        let i = 0;
        let sorted = true;
        while (sorted && i < res.body.length -1){
          sorted = sorted && res.body[i].Rating <= res.body[i +1].Rating;
          i++;
        }
      });
  });

});