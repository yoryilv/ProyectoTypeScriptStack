#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { ProyectoTypeScriptStack } from '../lib/proyecto-typescript-stack';

// Definir el ID de la cuenta de AWS
const account_id = '391666133763';

// Crear una instancia del sintetizador Legacy, que no requiere bootstrap
const sintetizador = new cdk.LegacyStackSynthesizer();

const app = new cdk.App();
new ProyectoTypeScriptStack(app, 'ProyectoTypeScriptStack', {
  env: { account: account_id, region: 'us-east-1' },
  synthesizer: sintetizador
});

app.synth();
