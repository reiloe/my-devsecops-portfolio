import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/blog',
    component: ComponentCreator('/blog', 'a89'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '182'),
    exact: true
  },
  {
    path: '/blog/authors',
    component: ComponentCreator('/blog/authors', '0b7'),
    exact: true
  },
  {
    path: '/blog/docker-container-security',
    component: ComponentCreator('/blog/docker-container-security', '85f'),
    exact: true
  },
  {
    path: '/blog/kubernetes-networking-explained',
    component: ComponentCreator('/blog/kubernetes-networking-explained', 'baf'),
    exact: true
  },
  {
    path: '/blog/kubernetes-security-best-practices',
    component: ComponentCreator('/blog/kubernetes-security-best-practices', 'e74'),
    exact: true
  },
  {
    path: '/blog/kubernetes-troubleshooting-guide',
    component: ComponentCreator('/blog/kubernetes-troubleshooting-guide', '24c'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '287'),
    exact: true
  },
  {
    path: '/blog/tags/cloud',
    component: ComponentCreator('/blog/tags/cloud', 'a60'),
    exact: true
  },
  {
    path: '/blog/tags/container',
    component: ComponentCreator('/blog/tags/container', 'b3d'),
    exact: true
  },
  {
    path: '/blog/tags/container-security',
    component: ComponentCreator('/blog/tags/container-security', '4fd'),
    exact: true
  },
  {
    path: '/blog/tags/containers',
    component: ComponentCreator('/blog/tags/containers', 'c53'),
    exact: true
  },
  {
    path: '/blog/tags/debugging',
    component: ComponentCreator('/blog/tags/debugging', 'dbe'),
    exact: true
  },
  {
    path: '/blog/tags/devops',
    component: ComponentCreator('/blog/tags/devops', '715'),
    exact: true
  },
  {
    path: '/blog/tags/devsecops',
    component: ComponentCreator('/blog/tags/devsecops', '3c1'),
    exact: true
  },
  {
    path: '/blog/tags/docker',
    component: ComponentCreator('/blog/tags/docker', '3b7'),
    exact: true
  },
  {
    path: '/blog/tags/infrastructure',
    component: ComponentCreator('/blog/tags/infrastructure', 'e4d'),
    exact: true
  },
  {
    path: '/blog/tags/kubernetes',
    component: ComponentCreator('/blog/tags/kubernetes', '0d1'),
    exact: true
  },
  {
    path: '/blog/tags/networking',
    component: ComponentCreator('/blog/tags/networking', 'd5a'),
    exact: true
  },
  {
    path: '/blog/tags/operations',
    component: ComponentCreator('/blog/tags/operations', 'bb8'),
    exact: true
  },
  {
    path: '/blog/tags/security',
    component: ComponentCreator('/blog/tags/security', '98f'),
    exact: true
  },
  {
    path: '/blog/tags/troubleshooting',
    component: ComponentCreator('/blog/tags/troubleshooting', '087'),
    exact: true
  },
  {
    path: '/blog/tags/welcome',
    component: ComponentCreator('/blog/tags/welcome', '9ce'),
    exact: true
  },
  {
    path: '/blog/welcome-to-devsecops-unlocked',
    component: ComponentCreator('/blog/welcome-to-devsecops-unlocked', 'ec9'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '6fb'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '4dc'),
        routes: [
          {
            path: '/docs/tags',
            component: ComponentCreator('/docs/tags', 'fce'),
            exact: true
          },
          {
            path: '/docs/tags/aws',
            component: ComponentCreator('/docs/tags/aws', 'e55'),
            exact: true
          },
          {
            path: '/docs/tags/aws-cli',
            component: ComponentCreator('/docs/tags/aws-cli', '005'),
            exact: true
          },
          {
            path: '/docs/tags/azure',
            component: ComponentCreator('/docs/tags/azure', '99f'),
            exact: true
          },
          {
            path: '/docs/tags/azure-cli',
            component: ComponentCreator('/docs/tags/azure-cli', '664'),
            exact: true
          },
          {
            path: '/docs/tags/bash',
            component: ComponentCreator('/docs/tags/bash', 'b6a'),
            exact: true
          },
          {
            path: '/docs/tags/cheat-sheet',
            component: ComponentCreator('/docs/tags/cheat-sheet', 'e34'),
            exact: true
          },
          {
            path: '/docs/tags/cloud',
            component: ComponentCreator('/docs/tags/cloud', 'ed2'),
            exact: true
          },
          {
            path: '/docs/tags/container-orchestration',
            component: ComponentCreator('/docs/tags/container-orchestration', '8e3'),
            exact: true
          },
          {
            path: '/docs/tags/containerization',
            component: ComponentCreator('/docs/tags/containerization', '02c'),
            exact: true
          },
          {
            path: '/docs/tags/containers',
            component: ComponentCreator('/docs/tags/containers', '3fc'),
            exact: true
          },
          {
            path: '/docs/tags/docker',
            component: ComponentCreator('/docs/tags/docker', '0d0'),
            exact: true
          },
          {
            path: '/docs/tags/gcloud',
            component: ComponentCreator('/docs/tags/gcloud', 'a11'),
            exact: true
          },
          {
            path: '/docs/tags/gcp',
            component: ComponentCreator('/docs/tags/gcp', 'c47'),
            exact: true
          },
          {
            path: '/docs/tags/git',
            component: ComponentCreator('/docs/tags/git', '549'),
            exact: true
          },
          {
            path: '/docs/tags/google-cloud',
            component: ComponentCreator('/docs/tags/google-cloud', 'adb'),
            exact: true
          },
          {
            path: '/docs/tags/infrastructure',
            component: ComponentCreator('/docs/tags/infrastructure', '49b'),
            exact: true
          },
          {
            path: '/docs/tags/k-8-s',
            component: ComponentCreator('/docs/tags/k-8-s', '2bf'),
            exact: true
          },
          {
            path: '/docs/tags/kubectl',
            component: ComponentCreator('/docs/tags/kubectl', '57b'),
            exact: true
          },
          {
            path: '/docs/tags/kubernetes',
            component: ComponentCreator('/docs/tags/kubernetes', 'a8b'),
            exact: true
          },
          {
            path: '/docs/tags/linux',
            component: ComponentCreator('/docs/tags/linux', '845'),
            exact: true
          },
          {
            path: '/docs/tags/shell',
            component: ComponentCreator('/docs/tags/shell', '81c'),
            exact: true
          },
          {
            path: '/docs/tags/system-administration',
            component: ComponentCreator('/docs/tags/system-administration', '2bd'),
            exact: true
          },
          {
            path: '/docs/tags/unix',
            component: ComponentCreator('/docs/tags/unix', '011'),
            exact: true
          },
          {
            path: '/docs/tags/vcs',
            component: ComponentCreator('/docs/tags/vcs', '3fd'),
            exact: true
          },
          {
            path: '/docs/tags/version-control',
            component: ComponentCreator('/docs/tags/version-control', '8c1'),
            exact: true
          },
          {
            path: '/docs',
            component: ComponentCreator('/docs', '4de'),
            routes: [
              {
                path: '/docs/',
                component: ComponentCreator('/docs/', '698'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides',
                component: ComponentCreator('/docs/guides', 'ba2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/cicd-lab/cicd-lab-setup-mac',
                component: ComponentCreator('/docs/guides/cicd-lab/cicd-lab-setup-mac', 'e6e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/cicd-lab/cicd-lab-setup-ubuntu',
                component: ComponentCreator('/docs/guides/cicd-lab/cicd-lab-setup-ubuntu', '4c8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/cicd-lab/cicd-lab-setup-windows',
                component: ComponentCreator('/docs/guides/cicd-lab/cicd-lab-setup-windows', '7ff'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/intro',
                component: ComponentCreator('/docs/guides/intro', 'f20'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/juiceshop-lab/linux/',
                component: ComponentCreator('/docs/guides/juiceshop-lab/linux/', '5c1'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/juiceshop-lab/local/',
                component: ComponentCreator('/docs/guides/juiceshop-lab/local/', 'b18'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/juiceshop-lab/mac/',
                component: ComponentCreator('/docs/guides/juiceshop-lab/mac/', 'dac'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/juiceshop-lab/windows/',
                component: ComponentCreator('/docs/guides/juiceshop-lab/windows/', '402'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/monitoring/elk-stack',
                component: ComponentCreator('/docs/guides/monitoring/elk-stack', 'dc3'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/monitoring/grafana',
                component: ComponentCreator('/docs/guides/monitoring/grafana', '142'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/monitoring/kibana',
                component: ComponentCreator('/docs/guides/monitoring/kibana', '8b5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/monitoring/logstash',
                component: ComponentCreator('/docs/guides/monitoring/logstash', '642'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/monitoring/nagios',
                component: ComponentCreator('/docs/guides/monitoring/nagios', '2e7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/monitoring/prometheus',
                component: ComponentCreator('/docs/guides/monitoring/prometheus', '519'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/monitoring/wazuh',
                component: ComponentCreator('/docs/guides/monitoring/wazuh', 'c8f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/pentesting-lab/pentesting-lab-setup',
                component: ComponentCreator('/docs/guides/pentesting-lab/pentesting-lab-setup', 'da7'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/pentesting-lab/pentesting-lab-setup-ubuntu',
                component: ComponentCreator('/docs/guides/pentesting-lab/pentesting-lab-setup-ubuntu', 'e15'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/guides/pentesting-lab/pentesting-lab-setup-windows',
                component: ComponentCreator('/docs/guides/pentesting-lab/pentesting-lab-setup-windows', '8ae'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base',
                component: ComponentCreator('/docs/knowledge-base', '60c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/cheat-sheets/aws-cli-commands',
                component: ComponentCreator('/docs/knowledge-base/cheat-sheets/aws-cli-commands', '7e5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/cheat-sheets/azure-cli-commands',
                component: ComponentCreator('/docs/knowledge-base/cheat-sheets/azure-cli-commands', 'd85'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/cheat-sheets/docker-commands',
                component: ComponentCreator('/docs/knowledge-base/cheat-sheets/docker-commands', 'c6b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/cheat-sheets/gcloud-cli-commands',
                component: ComponentCreator('/docs/knowledge-base/cheat-sheets/gcloud-cli-commands', '27b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/cheat-sheets/git-commands',
                component: ComponentCreator('/docs/knowledge-base/cheat-sheets/git-commands', '121'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/cheat-sheets/kubernetes-commands',
                component: ComponentCreator('/docs/knowledge-base/cheat-sheets/kubernetes-commands', 'a55'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/cheat-sheets/linux-commands',
                component: ComponentCreator('/docs/knowledge-base/cheat-sheets/linux-commands', '0ba'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/dataformats/json',
                component: ComponentCreator('/docs/knowledge-base/dataformats/json', '398'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/dataformats/yaml',
                component: ComponentCreator('/docs/knowledge-base/dataformats/yaml', '75c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/devops',
                component: ComponentCreator('/docs/knowledge-base/devops', '4db'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/devops/ci-cd/aws-codepipeline',
                component: ComponentCreator('/docs/knowledge-base/devops/ci-cd/aws-codepipeline', '1b6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/devops/ci-cd/azure-devops',
                component: ComponentCreator('/docs/knowledge-base/devops/ci-cd/azure-devops', '83d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/devops/ci-cd/bamboo-cicd',
                component: ComponentCreator('/docs/knowledge-base/devops/ci-cd/bamboo-cicd', '600'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/devops/ci-cd/docker',
                component: ComponentCreator('/docs/knowledge-base/devops/ci-cd/docker', 'b93'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/devops/ci-cd/gcp-cloud-build',
                component: ComponentCreator('/docs/knowledge-base/devops/ci-cd/gcp-cloud-build', '116'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/devops/ci-cd/github-actions',
                component: ComponentCreator('/docs/knowledge-base/devops/ci-cd/github-actions', '8f0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/devops/ci-cd/gitlab',
                component: ComponentCreator('/docs/knowledge-base/devops/ci-cd/gitlab', '3ef'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/devops/ci-cd/gitlab-cicd',
                component: ComponentCreator('/docs/knowledge-base/devops/ci-cd/gitlab-cicd', 'cfb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/devops/ci-cd/gitops',
                component: ComponentCreator('/docs/knowledge-base/devops/ci-cd/gitops', 'a64'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/devops/ci-cd/jenkins-cicd',
                component: ComponentCreator('/docs/knowledge-base/devops/ci-cd/jenkins-cicd', 'b4d'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/devops/devsecops',
                component: ComponentCreator('/docs/knowledge-base/devops/devsecops', '9ea'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/infrastructure/git',
                component: ComponentCreator('/docs/knowledge-base/infrastructure/git', 'd48'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/infrastructure/git/git_feature_lebenszyklus',
                component: ComponentCreator('/docs/knowledge-base/infrastructure/git/git_feature_lebenszyklus', '746'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/infrastructure/git/git_flow_und_pull_request',
                component: ComponentCreator('/docs/knowledge-base/infrastructure/git/git_flow_und_pull_request', 'd33'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/infrastructure/linux/diskmanagement',
                component: ComponentCreator('/docs/knowledge-base/infrastructure/linux/diskmanagement', '718'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/infrastructure/linux/heredocuments',
                component: ComponentCreator('/docs/knowledge-base/infrastructure/linux/heredocuments', '444'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/infrastructure/linux/jsonparserjq',
                component: ComponentCreator('/docs/knowledge-base/infrastructure/linux/jsonparserjq', 'b7b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/infrastructure/linux/pipesredirection',
                component: ComponentCreator('/docs/knowledge-base/infrastructure/linux/pipesredirection', 'a3e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/infrastructure/linux/userpermissions',
                component: ComponentCreator('/docs/knowledge-base/infrastructure/linux/userpermissions', '73c'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/infrastructure/linux/vivim',
                component: ComponentCreator('/docs/knowledge-base/infrastructure/linux/vivim', '4c8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/intro',
                component: ComponentCreator('/docs/knowledge-base/intro', 'af5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/network/dhcp-protocol',
                component: ComponentCreator('/docs/knowledge-base/network/dhcp-protocol', 'f67'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/network/dns-domain-name-system',
                component: ComponentCreator('/docs/knowledge-base/network/dns-domain-name-system', 'ed2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/network/ipv4-addressing',
                component: ComponentCreator('/docs/knowledge-base/network/ipv4-addressing', 'a93'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/network/iso-osi-model',
                component: ComponentCreator('/docs/knowledge-base/network/iso-osi-model', 'ced'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/network/ports',
                component: ComponentCreator('/docs/knowledge-base/network/ports', '812'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/network/ssh-secure-shell',
                component: ComponentCreator('/docs/knowledge-base/network/ssh-secure-shell', '204'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/network/ssl-tls-encryption',
                component: ComponentCreator('/docs/knowledge-base/network/ssl-tls-encryption', '054'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/network/tcp-three-way-handshake',
                component: ComponentCreator('/docs/knowledge-base/network/tcp-three-way-handshake', '722'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/programming/buildtools/gradle',
                component: ComponentCreator('/docs/knowledge-base/programming/buildtools/gradle', '276'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/programming/buildtools/maven',
                component: ComponentCreator('/docs/knowledge-base/programming/buildtools/maven', '58b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/programming/buildtools/maven/maven_multi_module',
                component: ComponentCreator('/docs/knowledge-base/programming/buildtools/maven/maven_multi_module', 'fad'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/programming/buildtools/maven/maven_multi_module_git_flow',
                component: ComponentCreator('/docs/knowledge-base/programming/buildtools/maven/maven_multi_module_git_flow', 'ac5'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/programming/frameworks/django',
                component: ComponentCreator('/docs/knowledge-base/programming/frameworks/django', '738'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/programming/frameworks/flask',
                component: ComponentCreator('/docs/knowledge-base/programming/frameworks/flask', 'aba'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/programming/languages/bash',
                component: ComponentCreator('/docs/knowledge-base/programming/languages/bash', 'f22'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/programming/languages/go',
                component: ComponentCreator('/docs/knowledge-base/programming/languages/go', '6d6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/programming/languages/groovy',
                component: ComponentCreator('/docs/knowledge-base/programming/languages/groovy', '5de'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/tools/netcat',
                component: ComponentCreator('/docs/knowledge-base/tools/netcat', '139'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/tools/nmap',
                component: ComponentCreator('/docs/knowledge-base/tools/nmap', 'e27'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/knowledge-base/tools/wireshark',
                component: ComponentCreator('/docs/knowledge-base/tools/wireshark', '8e8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/babytools',
                component: ComponentCreator('/docs/projects/babytools', '6fb'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/challenges/easteregg/',
                component: ComponentCreator('/docs/projects/challenges/easteregg/', '357'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/challenges/nested-easteregg/nested-easeregg',
                component: ComponentCreator('/docs/projects/challenges/nested-easteregg/nested-easeregg', 'df6'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/challenges/visual-geo-stalking/',
                component: ComponentCreator('/docs/projects/challenges/visual-geo-stalking/', '272'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/challenges/zero-stars-alternative-solution/',
                component: ComponentCreator('/docs/projects/challenges/zero-stars-alternative-solution/', '2e0'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/conduit',
                component: ComponentCreator('/docs/projects/conduit', 'ee2'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/conduit-cicd',
                component: ComponentCreator('/docs/projects/conduit-cicd', 'e5f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/juiceshop',
                component: ComponentCreator('/docs/projects/juiceshop', 'cec'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/minecraft',
                component: ComponentCreator('/docs/projects/minecraft', '026'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/overview',
                component: ComponentCreator('/docs/projects/overview', '54b'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/trucksignsapi',
                component: ComponentCreator('/docs/projects/trucksignsapi', '855'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/vserver',
                component: ComponentCreator('/docs/projects/vserver', 'b8a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/projects/wordpress',
                component: ComponentCreator('/docs/projects/wordpress', '6ec'),
                exact: true,
                sidebar: "tutorialSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
