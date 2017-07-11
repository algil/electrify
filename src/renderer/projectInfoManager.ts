import BluebirdPromise from "bluebird-lst"
import { IDiff } from "deep-diff"
import { ipcRenderer } from "electron"
import LoadingBar from "iview/src/components/loading-bar"
import Vue from "vue"
import { Listener } from "xstream"
import { ProjectInfo } from "../common/projectInfo"
import { Lazy } from "../main/util"
import { Applicator, RxIpc } from "../rx-ipc/rx-ipc"

class ProjectInfoListener implements Listener<ProjectInfo>, Applicator {
  constructor(private resolve: ((data: ProjectInfo) => void) | null, private reject: ((error: Error | any) => void) | null) {
    LoadingBar.start()
  }

  applyChanges(changes: Array<IDiff>): void {
    for (const change of changes) {
      let it: any = info!
      let i = -1
      const last = change.path ? change.path.length - 1 : 0
      while (++i < last) {
        if (typeof it[change.path[i]] === "undefined") {
          Vue.set(it, change.path[i], (typeof change.path[i] === "number") ? [] : {})
        }
        it = it[change.path[i]]
      }
      switch (change.kind) {
        case "A":
          applyArrayChange(change.path ? it[change.path[i]] : it, change.index!, change.item!)
          break

        case "D":
          Vue.delete(it, change.path[i])
          break

        case "E":
        case "N":
          Vue.set(it, change.path[i], change.rhs)
          break
      }
    }
  }

  next(data: ProjectInfo): void {
    const resolve = this.resolve
    if (resolve == null) {
      Object.assign(info, data)
    }
    else {
      info = data
      LoadingBar.finish()
      this.resolve = null
      resolve(data)
    }
  }

  error(error: any): void {
    const reject = this.reject
    if (reject == null) {
      console.error()
    }
    else {
      LoadingBar.finish()
      this.reject = null
      console.error(error)
      reject(error instanceof Error ? error : new Error(error))
    }
  }

  complete(): void {
    // ignored
  }
}

let info: ProjectInfo | null = null

const subscription = new Lazy<ProjectInfo>(() => new BluebirdPromise<ProjectInfo>((resolve, reject) => {
  const listener = new ProjectInfoListener(resolve, reject)
  new RxIpc(ipcRenderer).runCommand<ProjectInfo>("toolStatus", null, null, listener)
    .subscribe(listener)
}))

export async function getInfo(): Promise<ProjectInfo> {
  if (info != null) {
    return info
  }
  return await subscription.value
}

function applyArrayChange(array: Array<string>, index: number, change: IDiff): void {
  if (change.path && change.path.length) {
    let it: any = array[index]
    let i = 0
    const u = change.path.length - 1
    for (; i < u; i++) {
      it = it[change.path[i]]
    }

    switch (change.kind) {
      case "A":
        applyArrayChange(it[change.path[i]], change.index!, change.item!)
        break

      case "D":
        Vue.delete(it, change.path[i])
        break

      case "E":
      case "N":
        Vue.set(it, change.path[i], change.rhs)
        break
    }
  }
  else {
    switch (change.kind) {
      case "A":
        applyArrayChange(array[index] as any, change.index!, change.item!)
        break

      case "D":
        array.splice(index, 1)
        break

      case "E":
      case "N":
        Vue.set(array, index, change.rhs)
        break
    }
  }
}