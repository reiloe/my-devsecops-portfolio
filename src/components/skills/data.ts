export type Skill = { id: string; title: string; iconUrl?: string; description?: string[] };
const skills: Skill[] = [
  { id: 'linux', title: 'Linux', iconUrl: '/img/skills/linux.svg', description: ['User/Group administration', 'File/Folder permissions', 'CLI commands'] },
  { id: 'security', title: 'Secutity', iconUrl: '/img/skills/secu.png', description: ['simulate attacks and identify vulnerabilities', 'implementing pipeline security', 'login security'] },
  { id: 'juiceshop', title: 'OWASP JuiceShop', iconUrl: '/img/skills/juiceshop.png', description: ['XSS', 'SQL injection', 'Broken Access Control'] },

  { id: 'scripting', title: 'Shell scripting', iconUrl: '/img/skills/shell.png', description: ['writing scripts for automation', 'writing scripts for pentesting'] },
  { id: 'python', title: 'Python', iconUrl: '/img/skills/python.svg', description: ['writing scripts for automation', 'writing scripts for pentesting',] },
  { id: 'yaml', title: 'YAML', iconUrl: '/img/skills/yaml.png', description: ['K8/K3s deployment', 'Docker Compose files', 'complex data structures represents lists and maps'] },

  { id: 'cicd', title: 'CI/CD with GitHub Actions', iconUrl: '/img/skills/gh-actions.png', description: ['Automated builds and tests', 'Automated deployments', 'pre-built actions for common tasks'] },
  { id: 'docker', title: 'Docker / Docker Compose', iconUrl: '/img/skills/docker.png', description: ['CI/CD Pipelines', 'build microservice-based applications', 'automate building, testing, deploying applications'] },
  { id: 'kali', title: 'Kali Linux', iconUrl: '/img/skills/kali.svg', description: ['BurpSuite', 'OWASP ZAP', 'Metasploit'] },
];
export default skills;