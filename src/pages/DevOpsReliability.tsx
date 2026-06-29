import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { trackRender } from '../utils/profiler';
import { 
  Play, 
  CheckCircle, 
  RefreshCw, 
  Sliders, 
  Cpu, 
  Database, 
  Network, 
  Lock, 
  Unlock, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  History, 
  Sparkles, 
  ServerCrash, 
  Shield, 
  Workflow, 
  Layers
} from 'lucide-react';

export const DevOpsReliability: React.FC = () => {
  // Profiler tracking
  useEffect(() => {
    trackRender('DevOpsReliabilityPage');
  });

  const { toggleTask, tasks } = useStore();

  // 1. CI/CD Pipeline Simulator State
  const [ciCommitType, setCiCommitType] = useState<'healthy' | 'faulty'>('healthy');
  const [ciStatus, setCiStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [ciLogs, setCiLogs] = useState<string[]>([]);
  const [ciProgress, setCiProgress] = useState(0);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // 2. Terraform Designer State
  const [tfCloud, setTfCloud] = useState<'aws' | 'azure' | 'gcp'>('aws');
  const [tfResources, setTfResources] = useState({
    network: true,
    compute: true,
    storage: false,
    vault: false,
    security: true
  });
  const [tfTab, setTfTab] = useState<'code' | 'arch' | 'logs'>('code');
  const [tfLogs, setTfLogs] = useState<string[]>([]);
  const [tfRunning, setTfRunning] = useState(false);

  // 3. Docker & Kubernetes Scaling State
  const [k8sRps, setK8sRps] = useState(10);
  const [k8sReplicas, setK8sReplicas] = useState(1);
  const [k8sPods, setK8sPods] = useState<{ id: number; status: 'running' | 'pending' | 'terminating' }[]>([
    { id: 1, status: 'running' }
  ]);

  // 4. Cloud Security & Secrets State
  const [iamRole, setIamRole] = useState<'developer' | 'sre' | 'auditor' | 'root'>('developer');
  const [secretsRevealed, setSecretsRevealed] = useState(false);
  const [secretsLoading, setSecretsLoading] = useState(false);

  // 5. SRE Observability State
  const [chaosInjected, setChaosInjected] = useState<'none' | 'cpu' | 'latency' | 'outage'>('none');
  const [metrics, setMetrics] = useState({
    rps: 120,
    cpu: 32,
    latency: 140,
    errors: 0.1
  });
  const [alertsFired, setAlertsFired] = useState<string[]>([]);
  const [metricsHistory, setMetricsHistory] = useState<{ cpu: number; latency: number; errors: number }[]>(
    Array.from({ length: 15 }, () => ({ cpu: 32, latency: 140, errors: 0.1 }))
  );

  // Scroll terminal logs on CI/CD run
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ciLogs]);

  // 1. CI/CD Runner Engine Simulation
  const runPipeline = () => {
    setCiStatus('running');
    setCiLogs([]);
    setCiProgress(0);

    const logLines = [
      '🚀 Starting GitHub Actions pipeline configuration...',
      '⚙️ Initializing virtual machine: ubuntu-latest runner...',
      '🔧 Checking out Git repository branch: main',
      '📦 Setting up Node.js v20.x environment...',
      '📥 Running clean install: npm ci (retrieved 342 packages in 1.4s)',
      '🔬 [Step 1/3] Executing unit tests: npm run test',
      ciCommitType === 'healthy' 
        ? '✓ useWindowSize.test.ts (2 tests passed)\n✓ profiler.test.ts (4 tests passed)\n[SUCCESS] 6 tests passed successfully in 0.85s.'
        : '✗ useWindowSize.test.ts (1 test failed)\n\n  ● useWindowSize hook › should track window viewport correctly\n    AssertionError: expected 1024 to be 768\n\n[ERROR] Vitest suite execution failed. Exiting with code 1.',
      '🧹 [Step 2/3] Checking code formatting: npm run lint',
      '🏗️ [Step 3/3] Compiling TypeScript static web production bundle: npm run build',
      '📤 Uploading static application build to deployment bucket...',
      '🎉 SUCCESS: Deployment completed! Static bundle live at: http://localhost:5173'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < logLines.length) {
        // Skip build & deployment if tests failed
        if (ciCommitType === 'faulty' && currentStep >= 7) {
          setCiLogs(prev => [...prev, '❌ PIPELINE FAILURE: Test step returned non-zero code.', '⏹️ Aborting pipeline execution.']);
          setCiStatus('failed');
          setCiProgress(100);
          clearInterval(interval);
          
          // Auto complete tasks
          const task = tasks.find(t => t.category === 'DevOps & CI/CD');
          if (task && !task.completed) {
            // Leave uncompleted, failed run
          }
          return;
        }

        setCiLogs(prev => [...prev, logLines[currentStep]]);
        setCiProgress(Math.round(((currentStep + 1) / logLines.length) * 100));
        currentStep++;
      } else {
        setCiStatus('success');
        setCiProgress(100);
        clearInterval(interval);

        // Mark store task as completed
        const task = tasks.find(t => t.category === 'DevOps & CI/CD');
        if (task && !task.completed) {
          toggleTask(task.id);
        }
      }
    }, 850);
  };

  // 2. Terraform Generator
  const generateTerraformCode = () => {
    const isAws = tfCloud === 'aws';
    const isGcp = tfCloud === 'gcp';
    
    let resourcesStr = '';
    
    if (isAws) {
      resourcesStr += `provider "aws" {
  region = "us-east-1"
}\n\n`;
      if (tfResources.network) {
        resourcesStr += `resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "presidio-week4-vpc"
  }
}\n\n`;
      }
      if (tfResources.compute) {
        resourcesStr += `resource "aws_instance" "web_server" {
  ami           = "ami-0c55b159cbfafe1f0" # Ubuntu 22.04 LTS
  instance_type = "t3.micro"
  subnet_id     = \${aws_subnet.public.id}
  
  metadata_options {
    http_tokens = "required" # Least privilege enforce IMDSv2
  }
  
  tags = {
    Environment = "production"
  }
}\n\n`;
      }
      if (tfResources.storage) {
        resourcesStr += `resource "aws_s3_bucket" "assets" {
  bucket = "presidio-curriculum-assets-prod"
}\n\nresource "aws_s3_bucket_server_side_encryption_configuration" "assets_sec" {
  bucket = aws_s3_bucket.assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
    }
  }
}\n\n`;
      }
      if (tfResources.vault) {
        resourcesStr += `resource "aws_secretsmanager_secret" "db_credentials" {
  name                    = "production/database/credentials"
  kms_key_id              = aws_kms_key.secrets.arn
  recovery_window_in_days = 7
}\n\n`;
      }
    } else if (isGcp) {
      resourcesStr += `provider "google" {
  project = "presidio-sde-week4"
  region  = "us-central1"
}\n\n`;
      if (tfResources.network) {
        resourcesStr += `resource "google_compute_network" "vpc_network" {
  name                    = "presidio-vpc"
  auto_create_subnetworks = false
}\n\n`;
      }
      if (tfResources.compute) {
        resourcesStr += `resource "google_compute_instance" "web_server" {
  name         = "web-server-gce"
  machine_type = "e2-micro"
  zone         = "us-central1-a"
  
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }
  
  network_interface {
    network = google_compute_network.vpc_network.name
  }
}\n\n`;
      }
      if (tfResources.storage) {
        resourcesStr += `resource "google_storage_bucket" "assets" {
  name          = "presidio-assets-prod"
  location      = "US"
  force_destroy = true
  
  uniform_bucket_level_access = true # Secure enforcement
}\n\n`;
      }
      if (tfResources.vault) {
        resourcesStr += `resource "google_secret_manager_secret" "db_cred" {
  secret_id = "database-credentials"
  replication {
    automatic = true
  }
}\n\n`;
      }
    } else {
      // Azure
      resourcesStr += `provider "azurerm" {
  features {}
}\n\n`;
      if (tfResources.network) {
        resourcesStr += `resource "azurerm_virtual_network" "vnet" {
  name                = "presidio-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = "eastus"
  resource_group_name = "presidio-rg"
}\n\n`;
      }
      if (tfResources.compute) {
        resourcesStr += `resource "azurerm_linux_virtual_machine" "vm" {
  name                = "web-server-vm"
  resource_group_name = "presidio-rg"
  location            = "eastus"
  size                = "Standard_B1s"
  admin_username      = "adminuser"
  
  network_interface_ids = [
    azurerm_network_interface.nic.id,
  ]
  
  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }
}\n\n`;
      }
      if (tfResources.storage) {
        resourcesStr += `resource "azurerm_storage_account" "storage" {
  name                     = "presidiostorageprod"
  resource_group_name      = "presidio-rg"
  location                 = "eastus"
  account_tier             = "Standard"
  account_replication_type = "LRS"
  min_tls_version          = "TLS1_2" # Secure TLS enforcement
}\n\n`;
      }
      if (tfResources.vault) {
        resourcesStr += `resource "azurerm_key_vault" "vault" {
  name                = "presidio-prod-vault"
  location            = "eastus"
  resource_group_name = "presidio-rg"
  tenant_id           = "00000000-0000-0000-0000-000000000000"
  sku_name            = "standard"
}\n\n`;
      }
    }
    
    if (tfResources.security) {
      resourcesStr += `# Least Privilege Role Binding config\n`;
      if (isAws) {
        resourcesStr += `resource "aws_iam_role" "least_privilege" {
  name = "web_server_least_privilege_role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}`;
      } else if (isGcp) {
        resourcesStr += `resource "google_service_account" "least_privilege" {
  account_id   = "web-server-sa"
  display_name = "Minimal permissions service account"
}`;
      } else {
        resourcesStr += `resource "azurerm_user_assigned_identity" "least_privilege" {
  name                = "web-server-identity"
  resource_group_name = "presidio-rg"
  location            = "eastus"
}`;
      }
    }
    
    return resourcesStr;
  };

  const runTerraformPlan = () => {
    setTfRunning(true);
    setTfTab('logs');
    setTfLogs([
      '🔍 Reading Terraform local configuration files...',
      '🛠️ Initializing backend providers & plugins...',
      '✔ Provider plugin initialized: HashiCorp Cloud Provider modules v5.24',
      '🔬 Refreshing Terraform state (evaluating real-world infrastructure gaps)...',
      '📋 Generating resource deployment execution plan...',
      '-------------------------------------------------------',
    ]);

    const activeResources = Object.keys(tfResources).filter(key => tfResources[key as keyof typeof tfResources]);

    setTimeout(() => {
      const addedLogs = [
        `+ [CREATE] Network fabric module: vpc_topology_infrastructure`,
        tfResources.compute ? `+ [CREATE] Compute node: web_server_instance_lts` : null,
        tfResources.storage ? `+ [CREATE] Cryptographic Encrypted Storage: cloud_assets_repository` : null,
        tfResources.vault ? `+ [CREATE] Enveloped Secret Storage vault: db_credentials_store` : null,
        tfResources.security ? `+ [CREATE] Role Access control attachment: least_privilege_credentials` : null,
        '-------------------------------------------------------',
        `Plan: ${activeResources.length} to add, 0 to change, 0 to destroy.`,
        '✨ Terraform Plan generated successfully. Executed in Dry-Run mode.'
      ].filter(Boolean) as string[];

      setTfLogs(prev => [...prev, ...addedLogs]);
      setTfRunning(false);

      // Complete Zustand Task
      const task = tasks.find(t => t.category === 'DevOps & IaC');
      if (task && !task.completed) {
        toggleTask(task.id);
      }
    }, 1200);
  };

  // 3. Kubernetes Replica Autoscaling Engine
  useEffect(() => {
    // Determine target replicas based on simulated traffic (RPS slider)
    // 10-200 RPS -> 1 Pod
    // 201-400 RPS -> 2 Pods
    // 401-650 RPS -> 3 Pods
    // 651-850 RPS -> 4 Pods
    // 851-1000 RPS -> 5 Pods
    let target = 1;
    if (k8sRps > 850) target = 5;
    else if (k8sRps > 650) target = 4;
    else if (k8sRps > 400) target = 3;
    else if (k8sRps > 200) target = 2;

    if (target === k8sReplicas) return;

    setK8sReplicas(target);

    // Adjust pods array to match target size
    setK8sPods(prev => {
      const currentCount = prev.filter(p => p.status !== 'terminating').length;
      if (target > currentCount) {
        // Spin up pods (Pending first, then Running)
        const newPods = [...prev];
        for (let i = prev.length + 1; i <= prev.length + (target - currentCount); i++) {
          newPods.push({ id: i, status: 'pending' });
        }
        
        // Auto convert pending to running
        setTimeout(() => {
          setK8sPods(pList => pList.map(p => p.status === 'pending' ? { ...p, status: 'running' } : p));
        }, 1500);

        return newPods;
      } else if (target < currentCount) {
        // Scale down: set extra pods to terminating, then remove them
        const activePods = prev.filter(p => p.status !== 'terminating');
        const keepCount = target;
        const removeCount = activePods.length - keepCount;

        let markedCount = 0;
        const newPods = prev.map(p => {
          if (p.status === 'running' && markedCount < removeCount) {
            markedCount++;
            return { ...p, status: 'terminating' as const };
          }
          return p;
        });

        // Remove from list after animation delay
        setTimeout(() => {
          setK8sPods(pList => pList.filter(p => p.status !== 'terminating'));
        }, 1500);

        return newPods;
      }
      return prev;
    });

    // Complete Zustand Tasks
    const taskContainers = tasks.find(t => t.category === 'DevOps & Containers');
    const taskOrch = tasks.find(t => t.category === 'DevOps & Orchestration');
    if (taskContainers && !taskContainers.completed) toggleTask(taskContainers.id);
    if (taskOrch && !taskOrch.completed) toggleTask(taskOrch.id);

  }, [k8sRps, k8sReplicas]);

  // 4. Secure Secrets Vault Fetch Simulation
  const simulateSecretsFetch = () => {
    setSecretsLoading(true);
    setTimeout(() => {
      setSecretsRevealed(true);
      setSecretsLoading(false);

      // Complete Zustand Task
      const task = tasks.find(t => t.category === 'DevOps & Security');
      if (task && !task.completed) {
        toggleTask(task.id);
      }
    }, 1000);
  };

  // 5. SRE Telemetry & Chaos Engineering Panel
  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate active metrics dynamically based on chaos configurations
      let baseCpu = 25 + Math.random() * 8;
      let baseLatency = 120 + Math.random() * 25;
      let baseErrors = 0.05 + Math.random() * 0.1;
      let baseRps = 120 + Math.floor(Math.random() * 15);

      if (chaosInjected === 'cpu') {
        baseCpu = 92 + Math.random() * 5;
        baseLatency = 380 + Math.random() * 80;
        baseErrors = 1.2 + Math.random() * 0.8;
      } else if (chaosInjected === 'latency') {
        baseCpu = 45 + Math.random() * 10;
        baseLatency = 920 + Math.random() * 150;
        baseErrors = 4.5 + Math.random() * 2.0;
      } else if (chaosInjected === 'outage') {
        baseCpu = 8 + Math.random() * 4;
        baseLatency = 3200 + Math.random() * 1000;
        baseErrors = 98.4 + Math.random() * 1.5;
        baseRps = 15 + Math.floor(Math.random() * 10);
      }

      setMetrics({
        rps: Math.round(baseRps),
        cpu: Math.round(baseCpu),
        latency: Math.round(baseLatency),
        errors: parseFloat(baseErrors.toFixed(2))
      });

      // Update historic charts array
      setMetricsHistory(prev => {
        const next = [...prev.slice(1), { cpu: baseCpu, latency: baseLatency, errors: baseErrors }];
        return next;
      });

      // Manage SRE alarm thresholds
      const alarms: string[] = [];
      if (baseCpu > 85) alarms.push('🔥 CRITICAL ALERT: Node CPU Utilization Exceeds 85% Trigger');
      if (baseLatency > 800) alarms.push('⏳ WARNING ALERT: HTTP Response Latency exceeds p95 SLA (800ms)');
      if (baseErrors > 5.0) alarms.push('🔴 CRITICAL ALERT: API Gateway Server Error rates spiked (>5.0%)');
      setAlertsFired(alarms);

      // Complete tasks if metrics are healthy and chaos was investigated
      if (chaosInjected !== 'none') {
        const task = tasks.find(t => t.category === 'DevOps & Monitoring');
        if (task && !task.completed) {
          toggleTask(task.id);
        }
      }
    }, 1500);

    return () => clearInterval(timer);
  }, [chaosInjected]);

  const restoreSystemHealth = () => {
    setChaosInjected('none');
  };

  const getRoleJson = () => {
    switch (iamRole) {
      case 'developer':
        return `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:ListBucket",
        "logs:DescribeLogStreams",
        "logs:GetLogEvents"
      ],
      "Resource": [
        "arn:aws:s3:::presidio-dev-assets/*",
        "arn:aws:logs:us-east-1:*:log-group:/aws/lambda/dev-*"
      ]
    }
  ]
}`;
      case 'sre':
        return `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:StartInstances",
        "ec2:StopInstances",
        "ec2:DescribeInstances",
        "autoscaling:UpdateAutoScalingGroup",
        "cloudwatch:PutMetricAlarm"
      ],
      "Resource": "*"
    }
  ]
}`;
      case 'auditor':
        return `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:GenerateCredentialReport",
        "iam:Get*",
        "iam:List*",
        "aws-portal:ViewBilling",
        "aws-portal:ViewUsage"
      ],
      "Resource": "*"
    }
  ]
}`;
      case 'root':
        return `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "*",
      "Resource": "*"
    }
  ]
}
/* ⚠️ CAUTION: VIOLATES LEAST PRIVILEGE PRINCIPLE */`;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title Header */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-brand-100 dark:border-brand-900/30 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div>
          <span className="px-3 py-1 text-[9px] font-bold tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-full border border-indigo-100 dark:border-indigo-900/30 font-mono uppercase">
            Curriculum Playground • Week 4
          </span>
          <h1 className="text-3xl md:text-4xl font-bold font-display mt-2 bg-gradient-to-r from-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            DevOps & System Reliability
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl text-sm">
            Learn and test pipeline flows, cloud infra architectures, scaling mechanics, security best practices, and observabilities hands-on.
          </p>
        </div>
      </div>

      {/* Grid of Interactive Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Module 1: CI/CD Pipeline Simulator */}
        <section className="glass-panel p-6 rounded-2xl flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Workflow size={20} />
              CI/CD Pipeline Simulator
            </h2>
            <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-mono font-bold">
              GitHub Actions / GitLab CI
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select standard build configurations, run the pipeline, and observe automated quality gates dynamically.
          </p>

          <div className="grid grid-cols-2 gap-3 bg-slate-100/50 dark:bg-zinc-900/40 p-3 rounded-xl">
            <div>
              <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold block mb-1">Commit Source</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setCiCommitType('healthy')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wide cursor-pointer transition-all border ${
                    ciCommitType === 'healthy' 
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-sm' 
                      : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-350 border-slate-200 dark:border-zinc-800'
                  }`}
                >
                  Healthy Commit
                </button>
                <button 
                  onClick={() => setCiCommitType('faulty')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-mono tracking-wide cursor-pointer transition-all border ${
                    ciCommitType === 'faulty' 
                      ? 'bg-red-500 text-white border-red-400 shadow-sm' 
                      : 'bg-white dark:bg-zinc-800 text-slate-600 dark:text-slate-350 border-slate-200 dark:border-zinc-800'
                  }`}
                >
                  Faulty Commit
                </button>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={runPipeline}
                disabled={ciStatus === 'running'}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-lg shadow-indigo-600/10 flex items-center justify-center gap-1.5"
              >
                {ciStatus === 'running' ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Run CI/CD Pipeline
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress bar */}
          {ciStatus !== 'idle' && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Pipeline Progress</span>
                <span>{ciProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    ciStatus === 'failed' ? 'bg-red-500' : ciStatus === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`}
                  style={{ width: `${ciProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Simulated Terminal logs */}
          <div className="flex-1 bg-zinc-950 text-slate-300 p-4 rounded-xl border border-zinc-900 font-mono text-xs max-h-56 min-h-56 overflow-y-auto flex flex-col justify-start">
            {ciLogs.length === 0 ? (
              <div className="text-zinc-650 italic self-center my-auto font-sans">
                Click "Run CI/CD Pipeline" to output build, test, and deploy logs...
              </div>
            ) : (
              ciLogs.map((log, idx) => {
                let colorClass = 'text-slate-300';
                if (log.startsWith('✓') || log.startsWith('🎉') || log.startsWith('[SUCCESS]')) colorClass = 'text-emerald-400';
                else if (log.startsWith('✗') || log.startsWith('❌') || log.startsWith('[ERROR]')) colorClass = 'text-red-400';
                else if (log.startsWith('🚀') || log.startsWith('⚙️') || log.startsWith('🔧') || log.startsWith('📦') || log.startsWith('📥')) colorClass = 'text-cyan-400';
                return (
                  <div key={idx} className={`whitespace-pre-wrap py-0.5 border-b border-zinc-950/20 ${colorClass}`}>
                    {log}
                  </div>
                );
              })
            )}
            <div ref={terminalEndRef} />
          </div>
        </section>

        {/* Module 2: Terraform Infrastructure Designer */}
        <section className="glass-panel p-6 rounded-2xl flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Layers size={20} />
              Terraform Architecture Planner
            </h2>
            <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-mono font-bold">
              Infrastructure as Code
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure target infrastructure modules dynamically and generate standard declarative configurations.
          </p>

          {/* Infrastructure Controls */}
          <div className="grid grid-cols-3 gap-2 bg-slate-100/50 dark:bg-zinc-900/40 p-3 rounded-xl text-xs">
            <div className="col-span-3">
              <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wider font-mono">Cloud Provider Target</label>
              <div className="flex gap-1.5 mt-1">
                {(['aws', 'azure', 'gcp'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setTfCloud(p)}
                    className={`flex-1 py-1 rounded-lg font-bold font-mono uppercase tracking-wider text-[10px] cursor-pointer transition-all border ${
                      tfCloud === p 
                        ? 'bg-indigo-600 border-indigo-500 text-white' 
                        : 'bg-white dark:bg-zinc-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-zinc-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-3 pt-2">
              <label className="text-[9px] text-slate-450 font-bold uppercase tracking-wider font-mono block mb-1.5">Provision Resource Fabrics</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries({
                  network: 'Virtual Network (VPC)',
                  compute: 'Virtual VM Instance',
                  storage: 'Encrypted Storage',
                  vault: 'Secrets Vault Engine',
                  security: 'Least Privilege SA'
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-1.5 cursor-pointer text-[10px] font-medium text-slate-600 dark:text-slate-300">
                    <input 
                      type="checkbox"
                      checked={tfResources[key as keyof typeof tfResources]}
                      onChange={(e) => setTfResources(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 h-3 w-3 cursor-pointer"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex gap-1.5 border-b border-slate-100 dark:border-zinc-900 pb-1.5">
            {(['code', 'arch', 'logs'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setTfTab(tab)}
                className={`px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition-colors uppercase tracking-wider font-mono ${
                  tfTab === tab 
                    ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-400 hover:text-slate-650'
                }`}
              >
                {tab === 'code' ? 'main.tf' : tab === 'arch' ? 'Topology Map' : 'Execution Logs'}
              </button>
            ))}

            <button
              onClick={runTerraformPlan}
              disabled={tfRunning}
              className="ml-auto px-3 py-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
            >
              {tfRunning ? <RefreshCw size={12} className="animate-spin" /> : <Play size={12} />}
              Plan
            </button>
          </div>

          {/* Code Area */}
          <div className="flex-1 bg-zinc-950 text-slate-350 p-4 rounded-xl border border-zinc-900 font-mono text-xs max-h-56 min-h-56 overflow-y-auto">
            {tfTab === 'code' && (
              <pre className="text-indigo-300/90 whitespace-pre">{generateTerraformCode()}</pre>
            )}

            {tfTab === 'arch' && (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-2">Resource Topology Diagram</span>
                <div className="flex flex-wrap gap-4 items-center justify-center bg-zinc-900/60 p-4 rounded-xl border border-zinc-800 w-full">
                  <div className="flex flex-col items-center p-2 rounded-lg bg-zinc-950 border border-indigo-500/30 text-indigo-400">
                    <Network size={18} />
                    <span className="text-[9px] mt-1 font-bold">VPC Fabric</span>
                  </div>
                  {tfResources.network && <span className="text-zinc-700">→</span>}
                  
                  {tfResources.compute && (
                    <div className="flex flex-col items-center p-2 rounded-lg bg-zinc-950 border border-emerald-500/30 text-emerald-400">
                      <Cpu size={18} />
                      <span className="text-[9px] mt-1 font-bold">VM Server</span>
                    </div>
                  )}
                  {tfResources.compute && (tfResources.storage || tfResources.vault) && <span className="text-zinc-700">→</span>}

                  <div className="flex flex-col gap-2">
                    {tfResources.storage && (
                      <div className="flex flex-col items-center p-2 rounded-lg bg-zinc-950 border border-cyan-500/30 text-cyan-400">
                        <Database size={16} />
                        <span className="text-[9px] mt-0.5 font-bold">Cloud Bucket</span>
                      </div>
                    )}
                    {tfResources.vault && (
                      <div className="flex flex-col items-center p-2 rounded-lg bg-zinc-950 border border-amber-500/30 text-amber-400">
                        <Lock size={16} />
                        <span className="text-[9px] mt-0.5 font-bold">Key Vault</span>
                      </div>
                    )}
                  </div>
                  
                  {tfResources.security && (
                    <div className="absolute right-4 bottom-4 p-1.5 rounded-lg bg-zinc-950 border border-red-500/20 text-red-400 flex items-center gap-1">
                      <Shield size={12} />
                      <span className="text-[8px] font-bold">LeastPrivilege SA</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tfTab === 'logs' && (
              <div className="space-y-1">
                {tfLogs.length === 0 ? (
                  <div className="text-zinc-650 italic text-center py-12 font-sans">
                    Click "Plan" button to trigger terraform plan validation logs...
                  </div>
                ) : (
                  tfLogs.map((log, idx) => {
                    let color = 'text-slate-350';
                    if (log.startsWith('+')) color = 'text-emerald-400';
                    else if (log.startsWith('✔') || log.startsWith('✨')) color = 'text-emerald-300';
                    else if (log.startsWith('📋') || log.startsWith('🔍')) color = 'text-cyan-400';
                    return <div key={idx} className={`py-0.5 border-b border-zinc-950/10 ${color}`}>{log}</div>;
                  })
                )}
              </div>
            )}
          </div>
        </section>

        {/* Module 3: Docker & Kubernetes Scale Simulator */}
        <section className="glass-panel p-6 rounded-2xl flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Sliders size={20} />
              Containers & Scale Simulator
            </h2>
            <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-mono font-bold">
              Docker / Kubernetes
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Compare optimized Docker images and simulate scaling target Kubernetes Pod replicas under live traffic scenarios.
          </p>

          {/* Docker Images Comparison */}
          <div className="bg-slate-100/50 dark:bg-zinc-900/40 p-4 rounded-xl space-y-3">
            <h3 className="text-xs font-bold font-mono uppercase tracking-wide text-slate-400">Docker Image Size Optimization</h3>
            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between font-mono font-bold mb-1">
                  <span className="text-slate-600 dark:text-slate-350">Single-stage Image Size (Raw Node)</span>
                  <span className="text-red-500">852 MB</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-zinc-850 h-3.5 rounded-full overflow-hidden flex items-center px-2">
                  <div className="bg-red-500/80 h-2.5 rounded-full w-full"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between font-mono font-bold mb-1">
                  <span className="text-slate-600 dark:text-slate-350">Optimized Multi-stage Image (Nginx Static)</span>
                  <span className="text-emerald-500">45 MB (-95%)</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-zinc-850 h-3.5 rounded-full overflow-hidden flex items-center px-2">
                  <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '5.2%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Kubernetes Replica Scale Simulator */}
          <div className="bg-slate-100/50 dark:bg-zinc-900/40 p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wide text-slate-400">K8s HPA Replica Scaling</h3>
              <span className="text-[10px] font-bold font-mono bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 dark:text-indigo-400 px-2 py-0.5 rounded">
                Active Replicas: {k8sReplicas}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold font-mono text-slate-600 dark:text-slate-350">
                <span>Simulated Request Load (RPS)</span>
                <span className="text-indigo-600 dark:text-indigo-400">{k8sRps} Requests/sec</span>
              </div>
              <input 
                type="range"
                min="10"
                max="1000"
                value={k8sRps}
                onChange={(e) => setK8sRps(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-ew-resize bg-slate-200 dark:bg-zinc-850 h-1.5 rounded-lg appearance-none"
              />
            </div>

            {/* Pod Grid visualization */}
            <div className="space-y-1.5 pt-1.5">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold font-mono">Cluster Pod Pod List Grid</span>
              <div className="grid grid-cols-5 gap-2.5">
                {k8sPods.map(pod => (
                  <div 
                    key={pod.id} 
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 ${
                      pod.status === 'running' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/10 border-emerald-500/30 text-emerald-500 shadow-md shadow-emerald-500/5' 
                        : pod.status === 'pending'
                        ? 'bg-amber-50 dark:bg-amber-950/10 border-amber-500/30 text-amber-500 animate-pulse'
                        : 'bg-red-50 dark:bg-red-950/10 border-red-500/30 text-red-500 opacity-60'
                    }`}
                  >
                    <Cpu size={16} />
                    <span className="text-[8px] font-mono font-bold tracking-tight">pod-{pod.id}</span>
                    <span className="text-[7px] uppercase font-bold tracking-wider font-mono px-1 rounded bg-slate-100 dark:bg-zinc-900 border border-slate-250 dark:border-zinc-800">
                      {pod.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Module 4: Cloud Security Policies & Secrets Vault */}
        <section className="glass-panel p-6 rounded-2xl flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-display flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Shield size={20} />
              Least Privilege & Secrets Console
            </h2>
            <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-mono font-bold">
              IAM / Secrets Manager
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enforce IAM Policies adhering to Least Privilege configurations and simulate secure key store token exchange.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            
            {/* IAM Role Selector */}
            <div className="space-y-3 flex flex-col">
              <div>
                <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold block mb-1">Select IAM Role Scope</label>
                <select 
                  value={iamRole}
                  onChange={(e) => setIamRole(e.target.value as any)}
                  className="w-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="developer">Developer (Min Read/Write)</option>
                  <option value="sre">SRE Operator (Compute & ASG)</option>
                  <option value="auditor">Security Auditor (Read Only IAM)</option>
                  <option value="root">Root Administrator (*:* Privilege)</option>
                </select>
              </div>

              <div className="flex-1 bg-zinc-950 p-3 rounded-xl border border-zinc-900 font-mono text-[10px] max-h-40 overflow-y-auto text-indigo-300">
                <pre className="whitespace-pre">{getRoleJson()}</pre>
              </div>
            </div>

            {/* Secrets Manager Simulator */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/40 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div className="space-y-1">
                <h3 className="text-xs font-bold font-mono uppercase tracking-wide text-slate-400 flex items-center gap-1">
                  <Lock size={12} className="text-indigo-500" />
                  Secrets Vault Simulator
                </h3>
                <p className="text-[11px] text-slate-450 leading-relaxed">
                  Rather than baking config secrets inside clear text environment files, retrieve values securely at runtime.
                </p>
              </div>

              <div className="space-y-2 bg-zinc-950 p-3 rounded-xl border border-zinc-900 font-mono text-xs text-slate-300 flex-1 flex flex-col justify-center">
                <div className="text-[10px] text-zinc-550 border-b border-zinc-900 pb-1 flex justify-between">
                  <span>DB_CONNECTION_STRING</span>
                  <span className="font-bold text-amber-500">SECRET</span>
                </div>
                
                {secretsLoading ? (
                  <div className="text-slate-500 italic text-center py-4 flex items-center justify-center gap-2">
                    <RefreshCw size={14} className="animate-spin text-indigo-500" />
                    Fetching encrypted credentials...
                  </div>
                ) : secretsRevealed ? (
                  <div className="space-y-1.5 pt-1.5">
                    <div className="text-emerald-400 select-all overflow-x-auto whitespace-nowrap scrollbar-none">
                      postgresql://db_prod_user:J$f82kK#9@db-cluster.us-east-1.rds.amazonaws.com:5432/main
                    </div>
                    <div className="text-[9px] text-slate-500 leading-normal flex items-center gap-1">
                      <Unlock size={10} className="text-emerald-500 shrink-0" />
                      <span>Decrypted via temporary token credentials.</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-zinc-650 italic text-center py-4 select-none">
                    🔑 Value is encrypted: ENC(vault:rds_cred)
                  </div>
                )}
              </div>

              <button
                onClick={simulateSecretsFetch}
                disabled={secretsLoading || secretsRevealed}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                {secretsRevealed ? (
                  <>
                    <CheckCircle size={14} className="text-emerald-400" />
                    Secrets Decrypted Successfully
                  </>
                ) : (
                  <>
                    <Unlock size={14} />
                    Decrypt Secrets Key Vault
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Module 5: SRE Telemetry & Observability Panel */}
        <section className="glass-panel p-6 rounded-2xl flex flex-col space-y-4 lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold font-display flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                <Activity size={20} />
                SRE Real-Time Observability Panel
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Observe live telemetry logs. Trigger fault injections (chaos tests) and practice rolling out mitigations.
              </p>
            </div>
            
            <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded font-mono font-bold self-start sm:self-center">
              Prometheus & Grafana Console
            </span>
          </div>

          {/* Alarm Banner if alerts exist */}
          {alertsFired.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium animate-pulse">
              <div className="space-y-0.5">
                {alertsFired.map((alert, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <AlertTriangle size={14} className="shrink-0" />
                    {alert}
                  </div>
                ))}
              </div>
              <button 
                onClick={restoreSystemHealth}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-colors shrink-0 shadow-md shadow-red-600/20"
              >
                Trigger Rollback & Mitigate
              </button>
            </div>
          )}

          {/* Grafana Gauges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Metric Card 1 */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/40 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold font-mono text-slate-400 block uppercase tracking-wider">Request Rate</span>
                <span className="text-xl font-bold font-mono text-slate-700 dark:text-slate-200">{metrics.rps} RPS</span>
                <span className="text-[10px] text-slate-400 block mt-1 font-mono">http_requests_total</span>
              </div>
              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">
                <TrendingUp size={18} />
              </div>
            </div>

            {/* Metric Card 2 */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/40 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold font-mono text-slate-400 block uppercase tracking-wider">CPU Utilization</span>
                <span className={`text-xl font-bold font-mono ${metrics.cpu > 80 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                  {metrics.cpu}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-1 font-mono">container_cpu_usage</span>
              </div>
              <div className={`p-3 rounded-lg ${metrics.cpu > 80 ? 'bg-red-50 dark:bg-red-950/20 text-red-500' : 'bg-slate-100 dark:bg-zinc-900 text-slate-500'}`}>
                <Cpu size={18} />
              </div>
            </div>

            {/* Metric Card 3 */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/40 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold font-mono text-slate-400 block uppercase tracking-wider">Latency (p95 SLA)</span>
                <span className={`text-xl font-bold font-mono ${metrics.latency > 800 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                  {metrics.latency}ms
                </span>
                <span className="text-[10px] text-slate-400 block mt-1 font-mono">http_request_duration_ms</span>
              </div>
              <div className={`p-3 rounded-lg ${metrics.latency > 800 ? 'bg-red-50 dark:bg-red-950/20 text-red-500' : 'bg-slate-100 dark:bg-zinc-900 text-slate-500'}`}>
                <Activity size={18} />
              </div>
            </div>

            {/* Metric Card 4 */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/40 p-4 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[9px] font-bold font-mono text-slate-400 block uppercase tracking-wider">Error Rate (5xx)</span>
                <span className={`text-xl font-bold font-mono ${metrics.errors > 5.0 ? 'text-red-500' : 'text-slate-700 dark:text-slate-200'}`}>
                  {metrics.errors}%
                </span>
                <span className="text-[10px] text-slate-400 block mt-1 font-mono">http_errors_ratio</span>
              </div>
              <div className={`p-3 rounded-lg ${metrics.errors > 5.0 ? 'bg-red-50 dark:bg-red-950/20 text-red-500 animate-pulse' : 'bg-slate-100 dark:bg-zinc-900 text-slate-500'}`}>
                <ServerCrash size={18} />
              </div>
            </div>

          </div>

          {/* Controls & Mini Visual Chart */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Chaos Injection Buttons */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/40 p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wide text-slate-400 flex items-center gap-1">
                <AlertTriangle size={12} className="text-amber-500" />
                Chaos Engineering Injection
              </h3>
              <p className="text-[11px] text-slate-450">
                Trigger synthetic malfunctions inside the production replica instances to test alerts.
              </p>
              
              <div className="flex flex-col gap-2 pt-1.5">
                <button
                  onClick={() => setChaosInjected('cpu')}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold font-mono border text-left px-3 transition-colors cursor-pointer ${
                    chaosInjected === 'cpu' 
                      ? 'bg-red-500 border-red-400 text-white shadow-md' 
                      : 'bg-white dark:bg-zinc-800 text-slate-650 dark:text-slate-300 border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
                  }`}
                >
                  ⚡ Inject CPU Leak (Lease Spike)
                </button>
                <button
                  onClick={() => setChaosInjected('latency')}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold font-mono border text-left px-3 transition-colors cursor-pointer ${
                    chaosInjected === 'latency' 
                      ? 'bg-red-500 border-red-400 text-white shadow-md' 
                      : 'bg-white dark:bg-zinc-800 text-slate-650 dark:text-slate-300 border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
                  }`}
                >
                  ⏳ Inject DB Latency Leak
                </button>
                <button
                  onClick={() => setChaosInjected('outage')}
                  className={`w-full py-1.5 rounded-lg text-xs font-bold font-mono border text-left px-3 transition-colors cursor-pointer ${
                    chaosInjected === 'outage' 
                      ? 'bg-red-500 border-red-400 text-white shadow-md' 
                      : 'bg-white dark:bg-zinc-800 text-slate-650 dark:text-slate-300 border-slate-200 dark:border-zinc-800 hover:bg-slate-50'
                  }`}
                >
                  🔌 Simulate API Gateway Outage
                </button>
              </div>
            </div>

            {/* Sparkline history charts */}
            <div className="bg-slate-100/50 dark:bg-zinc-900/40 p-4 rounded-xl md:col-span-2 flex flex-col justify-between space-y-3">
              <h3 className="text-xs font-bold font-mono uppercase tracking-wide text-slate-400 flex items-center gap-1">
                <History size={12} className="text-indigo-500" />
                Historic Metrics Trend Monitor
              </h3>
              
              <div className="flex-1 grid grid-cols-3 gap-3 min-h-24">
                {/* CPU Trend */}
                <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 flex flex-col justify-between">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold">container_cpu</span>
                  <div className="h-10 flex items-end gap-0.5 pt-2">
                    {metricsHistory.map((m, i) => (
                      <div 
                        key={i} 
                        className={`w-full rounded-t-sm transition-all duration-300 ${
                          m.cpu > 80 ? 'bg-red-500' : m.cpu > 50 ? 'bg-amber-500' : 'bg-indigo-500'
                        }`}
                        style={{ height: `${m.cpu}%` }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Latency Trend */}
                <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 flex flex-col justify-between">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold">http_latency</span>
                  <div className="h-10 flex items-end gap-0.5 pt-2">
                    {metricsHistory.map((m, i) => {
                      const scaledHeight = Math.min((m.latency / 1200) * 100, 100);
                      return (
                        <div 
                          key={i} 
                          className={`w-full rounded-t-sm transition-all duration-300 ${
                            m.latency > 800 ? 'bg-red-500' : m.latency > 400 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ height: `${scaledHeight}%` }}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Error Trend */}
                <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 flex flex-col justify-between">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase font-bold">http_errors_ratio</span>
                  <div className="h-10 flex items-end gap-0.5 pt-2">
                    {metricsHistory.map((m, i) => {
                      const scaledHeight = Math.min((m.errors / 100) * 100, 100);
                      return (
                        <div 
                          key={i} 
                          className={`w-full rounded-t-sm transition-all duration-300 ${
                            m.errors > 5 ? 'bg-red-500' : m.errors > 1 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ height: `${Math.max(scaledHeight, 4)}%` }} // Minimum visible height
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-500 leading-normal flex items-center gap-1 bg-white dark:bg-zinc-950/40 p-2 rounded-lg border border-slate-150 dark:border-zinc-900">
                <Sparkles size={12} className="text-amber-500 shrink-0" />
                <span>Charts auto-compile and update live. Simulate chaos actions to witness real-time scaling events.</span>
              </div>
            </div>

          </div>
        </section>

        {/* Conceptual Section: DevOps vs SRE */}
        <section className="glass-panel p-6 rounded-2xl flex flex-col space-y-4 lg:col-span-2 bg-gradient-to-br from-slate-50/50 to-indigo-50/10 dark:from-zinc-950/50 dark:to-indigo-950/5 border border-indigo-100/40 dark:border-indigo-950/20">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-bold font-display">SRE vs DevOps: Operational Philosophy</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-650 dark:text-slate-350 leading-relaxed">
            <div className="space-y-2">
              <p>
                <strong>DevOps</strong> is a cultural and operational movement representing a set of principles aimed at breaking down silos between Development and Operations teams. It focuses on automated deliveries, high release velocities, shared responsibilities, and constant telemetry collections.
              </p>
              <div className="bg-white dark:bg-zinc-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-zinc-800/80 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                <span className="text-indigo-500 font-bold">interface</span> DevOps &#123;<br />
                &nbsp;&nbsp;automatePipelines(): void;<br />
                &nbsp;&nbsp;reduceSilos(): void;<br />
                &nbsp;&nbsp;measurePerformance(): void;<br />
                &#125;
              </div>
            </div>

            <div className="space-y-2">
              <p>
                <strong>Site Reliability Engineering (SRE)</strong> is a concrete software engineering approach to IT operations. SRE teams use software engineering practices to address reliability, latency, performance, scalability, emergency responses, and capacity management issues in production systems.
              </p>
              <div className="bg-white dark:bg-zinc-900/60 p-3 rounded-xl border border-slate-200/50 dark:border-zinc-800/80 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                <span className="text-indigo-500 font-bold">class</span> SiteReliabilityEngineer <span className="text-indigo-500 font-bold">implements</span> DevOps &#123;<br />
                &nbsp;&nbsp;automatePipelines() &#123; <span className="text-emerald-500">// write CI/CD YAML files</span> &#125;<br />
                &nbsp;&nbsp;manageErrorBudgets() &#123; <span className="text-emerald-500">// target 99.9% uptime SLA</span> &#125;<br />
                &nbsp;&nbsp;measurePerformance() &#123; <span className="text-emerald-500">// configure Prometheus/Grafana</span> &#125;<br />
                &#125;
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
