<style scoped>
  .ivu-card {
    margin-bottom: 10px
  }
</style>
<template>
  <div>
    <Card>
      <div slot="title">yarn
        <Tag v-if="yarn" color="green">Installed</Tag>
        <template v-else>
          <a href="https://yarnpkg.com/en/docs/install/" target="_blank"><Tag color="yellow">Not installed</Tag></a>
          Please <a href="https://yarnpkg.com/en/docs/install/" target="_blank">install.</a>
        </template>
      </div>
      <p><a href="https://yarnpkg.com/" target="_blank">Yarn</a> offers fast and reliable build, with reduced application size.</p>
      <ul>
        <li>-&nbsp;&nbsp;npm is unreliable and slow,</li>
        <li>-&nbsp;&nbsp;npm doesn't produce ideal dependency tree,</li>
        <li>-&nbsp;&nbsp;npm doesn't perform automatic deduplication and cleaning.</li>
      </ul>
    </Card>
    <Card>
      <div slot="title">electron-builder
        <Tag v-if="electronBuilder.installed" color="green">Installed</Tag>
        <template v-else>
          <Tag color="red">Not installed</Tag>
          Please install <a href="https://github.com/electron-userland/electron-builder/" target="_blank">electron-builder</a> locally.
        </template>
      </div>

      <template v-if="electronBuilder.latest != null">
        Latest electron-builder version: <a href="https://github.com/electron-userland/electron-builder/releases" target="_blank">{{electronBuilder.latest}}</a>
      </template>
      <code v-else>yarn add electron-builder --dev</code>
    </Card>
  </div>
</template>
<script lang="ts" src="./prerequisites.ts"></script>