
const db = require('../db/connection.js')
const testData = require('../db/data/test-data')
const request = require('supertest')
const app = require('../app.js')
const seed = require('../db/seeds/seed')


beforeEach(() => 
    seed(testData)
);

afterAll(()=> 
     db.end()
)


describe('GET /api', () => {
    describe('/api/topics', () => {
        test('200: Returns an array of topic objects with the following properties: slug, description.', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((res) => {
                expect(res.body.topics).toBeInstanceOf(Array)
                expect(res.body.topics.length).toBe(3)
            
                res.body.topics.forEach((topic) => {
                    expect(topic).toEqual(expect.objectContaining( {
                        slug: expect.any(String),
                        description: expect.any(String)
                    }))
                })
                
             })
             
        })
        test('404: Handles an error for a route that does not exist.', () => {
            return request(app)
            .get('/api/mango')
            .expect(404)
            .then((response) => {
                console.log(response.body)
                expect(response.body.msg).toBe('404: Not Found')
            })
        })
    })

    // describe('/api/articles/:article_id', () => {
    //     test('200: Returns the desired article when given an article_id ', () => {
            
    //         return request(app)
    //         .get('/api/articles/3')
    //         .expect(200)
    //         .then((response) => {
    //             ex

    //         })
            
    //     });
        
    // });

})