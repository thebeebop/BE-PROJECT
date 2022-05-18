
const db = require('../db/connection.js')
const testData = require('../db/data/test-data')
const request = require('supertest')
const app = require('../app.js')
const seed = require('../db/seeds/seed')


beforeEach(() => 
    seed(testData)
);

afterAll(()=> {
    db.end()
    })



describe('/api', () => {
    describe('GET /api/topics', () => {
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
                expect(response.body.msg).toBe('Not Found')
            })
        })
    })

    describe('GET /api/articles/:article_id', () => {
        test('200: Returns the desired article when given an article_id ', () => {
            
            return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then((response) => {
                expect(response.body.article).toEqual(
                {
                    article_id: 3,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: '2020-11-03T09:12:00.000Z',
                    votes: 0,
                })

            })
            
        });
        test('400: Given an invalid data-type, send the client a 400 bad request.', () => {
            return request(app)
            .get('/api/articles/silly')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toEqual('Bad Request')
            })
        })
        test('404: Valid but non-existent ID', () => {
            return request(app).get('/api/articles/999999')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toEqual('Not Found')
            })
        })
    });

    describe('PATCH /api/articles/:article_id', () => {
        test('200: Should update the relevant property by the given value of the specified id.', () => {

            const updateVote = { inc_votes: 40 } 

            return request(app)
            .patch('/api/articles/3')
            .expect(200)
            .send(updateVote)
            .then((response) => {
                expect(response.body.update).toEqual(
                    {
                        article_id: 3,
                        title: "Eight pug gifs that remind me of mitch",
                        topic: "mitch",
                        author: "icellusedkars",
                        body: "some gifs",
                        created_at: '2020-11-03T09:12:00.000Z',
                        votes: 40,
                    })

            })
            
        });
        test('400: Given a malformed body, respond with a 400: bad request',() => {
            const badBody = {}
            return request(app)
            .patch('/api/articles/3')
            .expect(400)
            .send(badBody)
            .then((response) => {
                expect(response.body.msg).toEqual('Bad Request')

            })
        });
        test('400: Given an incorrect data type, response with a 400: bad request ', () => {
            const wrongData = { inc_votes: 'vote' }

            return request(app)
            .patch('/api/articles/3')
            .expect(400)
            .send(wrongData)
            .then((response) => {
                expect(response.body.msg).toEqual('Bad Request')

            })
            
        });
        test('400: Returns "Bad Request" when trying to patch an article by an invalid article_id.', () => {
            const updateVote = { inc_votes: 40 }

            return request(app)
            .patch('/api/articles/potato')
            .expect(400)
            .send(updateVote)
            .then((response) => {
                expect(response.body.msg).toEqual('Bad Request')

            })
        });
        test('404: Respond with a "not found" message when given an unkown article_id.', () => {

            const updateVote = { inc_votes: 70 } 

            return request(app)
            .patch('/api/articles/5000')
            .send(updateVote)
            .then((response) => {
                expect(response.body.msg).toEqual('Not Found')

            })
        })


    });

    describe('GET /api/users', () => {
        test('200: Respond with an array of objects. Each object should have a property of "username".', () => {

            return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                expect(response.body.users).toBeInstanceOf(Array)
                expect(response.body.users.length).toBe(4)
                response.body.users.forEach((user) => {
                    expect(user).toEqual(expect.objectContaining( {
                        username: expect.any(String),
                        name: expect.any(String),
                        avatar_url: expect.any(String)
                    }))
                    
                })
               

            })
            
        });
        test('404: Respond with a 404 not found when given an unkown route.', () => {
            return request(app)
            .get('/api/monkey')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toEqual('Not Found')
            })

        })
    });

    describe.only('GET /api/articles/:article_id (comment count)', () => {

        test('200: An article response object should now include the property "comment_count". ', () => {

            request(app)
            .get('/api/articles/3')
            .expect(200)
            .then((response) => {
                console.log(response.body.article)
                expect(response.body.article).toEqual(
                    {
                    article_id: 3,
                    title: "Eight pug gifs that remind me of mitch",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "some gifs",
                    created_at: '2020-11-03T09:12:00.000Z',
                    votes: 0,
                    comment_count: 2

                    }
                )
            })
            
        });
        
    });
})

