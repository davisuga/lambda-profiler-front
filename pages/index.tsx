import Head from "next/head";
import styles from "../styles/Home.module.css";
import CSVReader from "react-csv-reader";

import Graph from "../components/Graph";
import TemperatureBarStack from "../components/TemperatureBarStack";
import { useState } from "react";
import { LogContent, LogContents, Logs } from "../types/domain";
import { pipe } from "pipe-ts";
import { parseLogs } from "../utils/logs-parse";
import { log } from "../utils/micelaneous";
import Example from "../components/Example";
const spreaderObj =
  <Dict extends Record<string, any>, Key extends keyof Dict>(
    fn: (...args: Key[]) => unknown
  ) =>
    (obj: Dict) =>
      fn(...obj.values());

const spreaderArr =
  <Key, Arr extends Key[]>(
    fn: (...args: Key[]) => unknown
  ) =>
    (obj: Arr) =>
      fn(...obj);

export default function Home() {
  const [currentFileData, setCurrentFileData] = useState<Logs | undefined>()

  const onFileChange = pipe(log,parseLogs, setCurrentFileData)
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <TemperatureBarStack width={1000} height={500} />
      <Example width={1000} height={500} />

      <Graph data={currentFileData} width={1000} height={500} />
      <main className={styles.main}>
        <h1 className={styles.title}>Upload the logs...</h1>
        <CSVReader
          cssClass="csv-reader-input"
          label="Select CSV with secret Death Star statistics"
          onFileLoaded={onFileChange}
        />
      </main>
    </div>
  );
}
