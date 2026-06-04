import app from './app'

const PORT = process.env.PORT || 3333

app.listen(PORT, () => {
  console.log(`\n🚀 ControleFin API rodando em http://localhost:${PORT}`)
  console.log(`📚 Swagger em http://localhost:${PORT}/api-docs\n`)
})