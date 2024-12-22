interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

interface CustomNodeJsGlobal extends NodeJS.Global {
  mongoose: GlobalMongoose | undefined;
}

declare const global: CustomNodeJsGlobal;
