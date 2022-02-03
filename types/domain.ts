import type { List } from "../utils/data-structures";

export type LogContent = [string, string, string];
export type LogContents = LogContent[];
export type Log = List<string | number | undefined>;
export type Logs = List<Log>;
export type EventData = {
  date: Date;
  title: string;
  resourceName: string;
  resourceValue: string;
};

export type HasCoords = {
  x: number;
  y: number;
};
