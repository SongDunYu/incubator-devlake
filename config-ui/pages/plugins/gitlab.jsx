import Head from 'next/head'
import { useState, useEffect } from 'react'
import styles from '../../styles/Home.module.css'
import { FormGroup, InputGroup, Button, TextArea, Intent } from "@blueprintjs/core"
import dotenv from 'dotenv'
import path from 'path'
import * as fs from 'fs/promises'
import { existsSync } from 'fs'
import Nav from '../../components/Nav'
import Sidebar from '../../components/Sidebar'
import Content from '../../components/Content'

export default function Home(props) {
  const { env } = props

  const [gitlabEndpoint, setGitlabEndpoint] = useState(env.GITLAB_ENDPOINT)
  const [gitlabAuth, setGitlabAuth] = useState(env.GITLAB_AUTH)

  function updateEnv(key, value) {
    fetch(`/api/setenv/${key}/${encodeURIComponent(value)}`)
  }

  function saveAll(e) {
    e.preventDefault()
    updateEnv('GITLAB_ENDPOINT', gitlabEndpoint)
    updateEnv('GITLAB_AUTH', gitlabAuth)
    alert('Config file updated, please restart devlake by running: \'docker-compose restart\' to apply new configuration')
  }

  return (
    <div className={styles.container}>

      <Head>
        <title>Devlake Config-UI</title>
        <meta name="description" content="Lake: Config" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;600&display=swap" rel="stylesheet" />
      </Head>

      <Nav />
      <Sidebar />
      <Content>
        <main className={styles.main}>

          <div className={styles.headlineContainer}>
            <h2 className={styles.headline}>Gitlab Configuration</h2>
            <p className={styles.description}>Gitlab account and config settings</p>
          </div>

          <div className={styles.formContainer}>
            <FormGroup
              label="API&nbsp;Endpoint"
              inline={true}
              labelFor="gitlab-endpoint"
              helperText="GITLAB_ENDPOINT"
              className={styles.formGroup}
              contentClassName={styles.formGroup}
            >
              <InputGroup
                id="gitlab-endpoint"
                placeholder="Enter Gitlab API endpoint"
                defaultValue={gitlabEndpoint}
                onChange={(e) => setGitlabEndpoint(e.target.value)}
                className={styles.input}
              />
            </FormGroup>
          </div>

          <div className={styles.formContainer}>
            <FormGroup
              label="Auth&nbsp;Token"
              inline={true}
              labelFor="gitlab-auth"
              helperText="GITLAB_AUTH"
              className={styles.formGroup}
              contentClassName={styles.formGroup}
            >
              <InputGroup
                id="gitlab-auth"
                placeholder="Enter Gitlab Auth Token eg. uJVEDxabogHbfFyu2riz"
                defaultValue={gitlabAuth}
                onChange={(e) => setGitlabAuth(e.target.value)}
                className={styles.input}
              />
            </FormGroup>
          </div>

          <Button type="submit" outlined={true} large={true} className={styles.saveBtn} onClick={saveAll}>Save Config</Button>
        </main>
      </Content>
    </div>
  )
}

export async function getStaticProps() {

  const filePath = process.env.ENV_FILEPATH || path.join(process.cwd(), 'data', '../../../.env')
  const exist = existsSync(filePath);
  if (!exist) {
    return {
      props: {
        env: {},
      }
    }
  }
  const fileData = await fs.readFile(filePath)
  const env = dotenv.parse(fileData)

  return {
    props: {
      env
    },
  }
}
