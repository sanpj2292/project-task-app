let app = { HOST: 'http://localhost:8000' }
if (process.env.NODE_ENV === 'production' && process.env.NODE_ENV) {
    app.HOST = 'https://project-task-app.herokuapp.com'
}

export default app;