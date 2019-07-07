import Image from '../image.model'
const chai = require('chai')
const expect = chai.expect

describe.skip('image graphql test', () => {
  it('get images', done => {
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            images{
              id
             }
           }`
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const data = res.body.data.images
        expect(data).is.to.be.an('array')
        done()
      })
  })

  it('get image', async () => {
    const findimage = await Image.findOne({ name: 'image_test' })
    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          query{
            image(id: "${findimage._id}"){
              id
             }
           }`
      })

    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
  })

  it('add image', done => {
    const newimage = {
      name: 'new image',
      value: 'blue'
    }
    chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          mutation{
            addimage(name: "${newimage.name}", value: "${newimage.value}"){
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

  it('delete image', async () => {
    const newimage = await Image.create({
      name: 'image',
      slug: 'slug',
      value: 'yellow'
    })
    const result = await chai
      .sendLocalRequest()
      .post('/graphql')
      .set('Accept', 'application/json')
      .send({
        query: `
          mutation{
            deleteimage(id: "${newimage._id}")
           }`
      })
    const status = result.status
    expect(status).to.be.equal(200)
    const data = result.body.data
    expect(data).is.to.be.an('object')
    expect(data.deleteimage).is.to.be.equal(true)
  })
})
