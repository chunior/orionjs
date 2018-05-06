import createInsert from './insert'
import Collection from '../index'
import generateId from './generateId'
import Model from '../../Model'

it('should return a function', async () => {
  const insert = createInsert({})
  expect(typeof insert).toBe('function')
})

it('inserts a document without errors', async () => {
  const Tests = await new Collection({name: generateId()}).await()

  await Tests.insert({hello: 'world'})
  const count = await Tests.find().count()
  expect(count).toBe(1)
})

it('should clean a document before inserting', async () => {
  const schema = {_id: {type: 'ID'}, name: {type: String}}
  const model = new Model({name: generateId(), schema})
  const Tests = await new Collection({name: generateId(), model}).await()

  const docId = await Tests.insert({name: 1234})
  const result = await Tests.findOne(docId)
  expect(result.name).toBe('1234')
})

it('should validate a document', async () => {
  const schema = {_id: {type: 'ID'}, name: {type: String}}
  const model = new Model({name: generateId(), schema})
  const Tests = await new Collection({name: generateId(), model}).await()

  expect.assertions(1)
  try {
    await Tests.insert({})
  } catch (error) {
    expect(error.message).toBe('Validation Error')
  }
})