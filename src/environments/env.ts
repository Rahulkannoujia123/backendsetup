export interface Environment {
  dbUrl?: string;
  jwtSecret?: string;
  jwtExpiresIn?: string;
  awsAccessKey?: string;
  awsSecretKey?: string;
  s3Bucket?: string;
  s3AssetUrl?: string;
  awsRegion?: string;
  slackToken?: string;
  sendGridApiKey?: string;
  webUrl?:string;
}

export function env(): Environment {
  return {
    dbUrl: process.env.DB_URL,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    awsAccessKey: process.env.AWS_KEY,
    awsSecretKey: process.env.AWS_SECRET,
    s3Bucket: process.env.S3_BUCKET,
    s3AssetUrl: process.env.S3_ASSET_URL,
    awsRegion: process.env.AWS_REGION,
    sendGridApiKey: process.env.SENDGRID_API_KEY,
    webUrl: process.env.WEB_URL
  };

}
