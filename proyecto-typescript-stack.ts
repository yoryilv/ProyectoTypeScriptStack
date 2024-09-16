import { Stack, StackProps, aws_ec2 as ec2, aws_iam as iam, aws_s3 as s3 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class ProyectoTypeScriptStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Definir el contexto del bootstrapVersion
    this.node.setContext('@aws-cdk/core:bootstrapVersion', 6);

    // Buscar la VPC por defecto
    const vpc = ec2.Vpc.fromLookup(this, 'DefaultVPC', { isDefault: true });

    // Asociar un Security Group existente usando su ID
    const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'SG', 'sg-0a89f55892deaf213');

    // Utilizar el Role IAM existente (LabRole)
    const labRole = iam.Role.fromRoleArn(this, 'LabRole', 'arn:aws:iam::391666133763:role/LabRole');

    // Crear una instancia EC2 con la nueva versión de MachineImage y keyPair
    const instance = new ec2.Instance(this, 'MyInstance', {
      instanceType: new ec2.InstanceType('t2.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux2(),
      vpc,
      keyName: 'vockey',
      securityGroup,
      role: labRole,
    });

    // Referenciar un bucket S3 existente
    const myBucket = s3.Bucket.fromBucketName(this, 'MyExistingBucket', 'bucket-cloud32');

    // Script para clonar los repositorios y ejecutar las aplicaciones web
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'sudo yum update -y',
      'sudo yum install -y git',
      'git clone https://github.com/yoryilv/websimple.git /home/ec2-user/websimple',
      'git clone https://github.com/yoryilv/webplantilla.git /home/ec2-user/webplantilla',
      'aws s3 cp /home/ec2-user/websimple s3://bucket-cloud32/websimple --recursive',
      'aws s3 cp /home/ec2-user/webplantilla s3://bucket-cloud32/webplantilla --recursive',
    );
    instance.addUserData(userData.render());

    // Agregar permisos para S3
    instance.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));
  }
}
