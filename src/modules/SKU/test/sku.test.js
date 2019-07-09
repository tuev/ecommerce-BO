import SKU from '../sku.model'
const chai = require('chai')
const expect = chai.expect

describe('sku graphql test', () => {
  it('get skus', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            skus{
              id
             }
           }`
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data.skus
        expect(data).is.to.be.an('array')
        done()
      })
  })

  it('get sku', async () => {
    const findsku = await SKU.findOne({ name: 'sku_test' })
    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            sku(id: "${findsku._id}"){
              id
             }
           }`
      })

    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
  })

  it('add sku', done => {
    const newsku = {
      name: 'new sku',
      slug: 'sku slug',
      description: 'test sku'
    }
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          mutation{
            addSKU(name: "${newsku.name}", slug: "${newsku.slug}"){
              id
             }
           }`
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data
        expect(data).is.to.be.an('object')
        done()
      })
  })

  it('delete sku', async () => {
    const newsku = await SKU.create({
      name: 'new sku',
      slug: 'slug',
      description: 'test sku'
    })
    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          mutation{
            deleteSKU(id: "${newsku._id}")
           }`
      })
    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
    expect(data.deleteSKU).is.to.be.equal(true)
  })
})
