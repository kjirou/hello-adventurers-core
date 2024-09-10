import { JobData } from "../types";

// TODO: 一般アクセサを生成するユーティリティを作りたい

export const jobsAsConst = [
  {
    id: "fighter",
    description: "",
    name: "Fighter",
    mainExpertiseId: "",
    stats: {},
  },
] as const satisfies JobData[];

export type JobId = (typeof jobsAsConst)[number]["id"];

export const jobs: JobData[] = jobsAsConst;
