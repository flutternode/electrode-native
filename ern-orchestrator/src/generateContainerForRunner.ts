import {
  AppVersionDescriptor,
  kax,
  NativePlatform,
  PackagePath,
} from 'ern-core'
import { runCauldronContainerGen, runLocalContainerGen } from './container'
import { runCauldronCompositeGen, runLocalCompositeGen } from './composite'
import { ContainerGenResult } from 'ern-container-gen'

export async function generateContainerForRunner(
  platform: NativePlatform,
  {
    baseComposite,
    napDescriptor,
    miniApps = [],
    jsApiImpls = [],
    outDir,
    jsMainModuleName,
    extra,
  }: {
    baseComposite?: PackagePath
    napDescriptor?: AppVersionDescriptor
    miniApps?: PackagePath[]
    jsApiImpls?: PackagePath[]
    outDir: string
    jsMainModuleName?: string
    extra?: any
  }
): Promise<ContainerGenResult> {
  if (napDescriptor) {
    const composite = await kax.task('Generating Composite from Cauldron').run(
      runCauldronCompositeGen(napDescriptor, {
        baseComposite,
      })
    )

    return kax.task('Generating Container from Cauldron').run(
      runCauldronContainerGen(napDescriptor, composite, {
        jsMainModuleName,
        outDir,
      })
    )
  } else {
    const composite = await kax.task('Generating Composite locally').run(
      runLocalCompositeGen(miniApps, {
        baseComposite,
        jsApiImpls,
      })
    )

    return kax.task('Generating Container locally').run(
      runLocalContainerGen(platform, composite, {
        extra: extra || {},
        jsMainModuleName,
        outDir,
      })
    )
  }
}
