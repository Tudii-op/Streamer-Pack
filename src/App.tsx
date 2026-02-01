// App.tsx
import Content from "./component/body/Content"
import Container from "./component/body/Container"
import Layout from "./component/layout/MainLayout"

export default function App() {
  return (
    <Layout>
      <Content />
      <Container />
    </Layout>
  )
}