import { describe, it } from 'mocha'
import * as t from '../src/'
import { expect } from 'chai'

const ServiceScalingParametersType = t.object({
  optional: {
    DesiredCount: t.number(),
    MaximumPercent: t.number(),
  },
})

const DeployConfigType = t.object({
  required: {
    DeploymentName: t.string(),
    /**
     * The domain name of the Route 53 hosted zone, for example: foo.com
     */
    HostedZoneDomainName: t.string(),
    /**
     * The id of the VPC to deploy into
     */
    VpcId: t.string(),
    /**
     * The AWS region to deploy into
     */
    region: t.string(),
    /**
     * The subnet ids for the Vpc.  Defaults to all available for VpcId
     */

    Redis: t.oneOf(
      t.object({
        required: {
          Type: t.string('External'),
          Host: t.string(),
        },
        optional: {
          Port: t.number(),
          DB: t.number(),
          SecurityGroupId: t.string(),
        },
      }),
      t.object({
        Type: t.string('ElastiCache'),
        AvailabilityZone: t.string(),
      })
    ),
    DB: t.oneOf(
      t.object({
        required: {
          Type: t.string('External'),
          Host: t.string(),
          User: t.string(),
          Name: t.string(),
          Password: t.string(),
        },
        optional: {
          Port: t.number(),
          RootDBName: t.string(),
          SecurityGroupId: t.string(),
        },
      }),
      t.object({
        Type: t.string('RDS'),
        MasterUserPassword: t.string(),
        AvailabilityZone: t.string(),
      })
    ),
    Historian: t.object({
      required: {
        DB: t.object({
          required: {
            Host: t.string(),
            User: t.string(),
            Password: t.string(),
            Name: t.string(),
          },
          optional: {
            Port: t.number(),
            SecurityGroupId: t.string(),
          },
        }),
      },
      optional: {
        Redis: t.object({
          required: {
            Host: t.string(),
          },
          optional: {
            Port: t.number(),
            SecurityGroupId: t.string(),
          },
        }),
      },
    }),
    Services: t.object({
      required: {
        MQTT: t.object({
          required: {
            RateLimit: t.number(),
          },
          optional: {
            DesiredCount: t.number(),
            MaximumPercent: t.number(),
          },
        }),
      },
      optional: {
        Webapp: ServiceScalingParametersType,
        RedirectHttps: ServiceScalingParametersType,
        NotificationSender: ServiceScalingParametersType,
        ActivityHistorian: ServiceScalingParametersType,
        ZeroMinimumHealthyPercent: t.boolean(),
      },
    }),
    ReCaptcha: t.object({
      LoginMinScore: t.number(),
      SignupMinScore: t.number(),
      SiteKey: t.string(),
      SecretKey: t.string(),
    }),
    Stripe: t.object({
      PublishableKey: t.string(),
      SecretKey: t.string(),
    }),
    LiveChat: t.object({
      License: t.string(),
    }),
    NotificationsApi: t.object({
      Url: t.string(),
      Token: t.string(),
    }),
    ClarityDockerImageTag: t.string(),
    JWT: t.object({
      SecretKey: t.string(),
    }),
  },
  optional: {
    AppName: t.string(),
    /**
     * The base domain name of the app, for example: clarity.foo.com
     */
    BaseDomainName: t.string(),
    SubnetIds: t.array(t.string()),
    /**
     * Name of an existing EC2 KeyPair to enable SSH access to the ECS instances
     */
    EC2KeyName: t.string(),
    VPN: t.object({
      optional: {
        CidrIp: t.string(),
        SecurityGroupId: t.string(),
      },
    }),
    /**
     * Settings for the user upload/download S3 buckets that Clarity uses.
     * Not applicable to CloudFormationTemplateBucket or CertificateProvider.S3BucketName.
     */
    S3: t.object({
      optional: {
        /**
         * The origin URLs that the S3 buckets will allow.
         * For prod, just the public URL of the app.  For staging,
         * you probably want a wildcard pattern like https://clarity-staging-*.foo.com
         */
        AllowedOrigin: t.string(),
      },
    }),
    ECSCluster: t.object({
      optional: {
        ClusterId: t.string(),
        MinSize: t.number(),
        MaxSize: t.number(),
        DesiredCapacity: t.number(),
        InstanceType: t.string(),
      },
    }),
    CertificateProvider: t.object({
      optional: {
        StackName: t.string(),
        S3BucketName: t.string(),
        CFNCustomProviderZipFileName: t.string(),
        LambdaFunctionName: t.string(),
      },
    }),
    CloudFormationTemplateBucket: t.oneOf(t.string(), t.null()),
    JCoreIOLink: t.string(),
    Superadmin: t.object({
      optional: {
        Email: t.string(),
        Password: t.string(),
      },
    }),
  },
})

type DeployConfig = t.ExtractType<typeof DeployConfigType>

describe(`smoke test`, function () {
  it(`works`, function () {
    const config: DeployConfig = {
      CloudFormationTemplateBucket: 'templates.clarity.foo.com',
      DeploymentName: 'clarity-new',
      HostedZoneDomainName: 'foo.com',
      VpcId: 'vpc-222222222',
      region: 'us-west-2',
      SubnetIds: ['subnet-222222222'],
      VPN: {
        CidrIp: '172.0.0.0/32',
      },
      Redis: {
        Type: 'ElastiCache',
        AvailabilityZone: 'us-west-2a',
      },
      DB: {
        Type: 'RDS',
        AvailabilityZone: 'us-west-2a',
        MasterUserPassword: 'blah',
      },
      Historian: {
        DB: {
          Host: 'historian-staging-db-01.foo.com',
          Password: '22222222222222222222222',
          User: 'postgres',
          Name: 'historian',
          SecurityGroupId: 'sg-22222222222',
        },
      },
      ECSCluster: {
        DesiredCapacity: 2,
      },
      Services: {
        MQTT: {
          RateLimit: 10000,
        },
        RedirectHttps: {
          DesiredCount: 3,
        },
      },
      ReCaptcha: {
        LoginMinScore: 0.15,
        SignupMinScore: 0.15,
        SiteKey: '22222222222222',
        SecretKey: '22222222222222',
      },
      Stripe: {
        PublishableKey: '22222222222222',
        SecretKey: '22222222222222',
      },
      LiveChat: {
        License: '222222222',
      },
      NotificationsApi: {
        Url: 'https://notifications-api.foo.com',
        Token: '22222222222222',
      },
      ClarityDockerImageTag: 'master',
      JCoreIOLink: 'http://foo.com',
      JWT: {
        SecretKey: '222222222222222',
      },
      Superadmin: {
        Email: 'dev@foo.com',
      },
    }

    DeployConfigType.assert(config)
    const {
      Redis, // eslint-disable-line @typescript-eslint/no-unused-vars
      ...rest
    } = config

    expect(() => DeployConfigType.assert(rest as any)).to.throw(
      t.RuntimeTypeError
    )
  })
})
