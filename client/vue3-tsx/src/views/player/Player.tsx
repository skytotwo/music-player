
import { VolumeMute, VolumeSmall, VolumeNotice, PauseOne, Play, GoStart, GoEnd } from '@icon-park/vue-next'
import { computed, defineComponent } from 'vue'
import './Player.scss'
import useCd from './useCd'
import useMode from './useMode'
import ProgressBar from '@/components/progress-bar/ProgressBar'
import { usePlayerStore } from '@/store/player'
import { formatTime } from '@/utils'
import emitter from '@/utils/emitter'

export default defineComponent({
  name: 'Player',
  setup () {
    // store
    const playerStore = usePlayerStore()
    const playing = computed(() => playerStore.playing)
    const currentSong = computed(() => playerStore.currentSong)
    const currentTime = computed(() => playerStore.currentTime)
    const volume = computed(() => playerStore.volume)

    // hooks
    const { currentMode, changeMode } = useMode()
    const { cdRef, cdCoverRef, cdClass } = useCd()

    // computed
    const PlayPause = computed(() => {
      return playing.value ? PauseOne : Play
    })
    const progress = computed(() => {
      const duration = currentSong.value?.duration ?? 0
      return currentTime.value / duration
    })
    const Volume = computed(() => {
      return volume.value === 0 ? VolumeMute : volume.value < 0.3 ? VolumeSmall : VolumeNotice
    })

    // methods
    const togglePlay = () => {
      playerStore.setPlaying(!playing.value)
    }

    const prev = () => emitter.emit('prev')
    const next = () => emitter.emit('next')

    const onProgressChanging = (progress: number) => {
      playerStore.setProgressChanging(true)
      playerStore.setCurrentTime(currentSong.value.duration! * progress)
    }
    const onProgressChanged = (progress: number) => {
      playerStore.setProgressChanging(false)

      const currentTime = currentSong.value.duration! * progress
      playerStore.setCurrentTime(currentTime)
      emitter.emit('changeTime', currentTime)

      if (!playing.value) { playerStore.setPlaying(true) }
    }

    const onVolumeChange = (volume: number) => {
      playerStore.setVolume(volume)
      emitter.emit('changeVolume', volume)
    }

    return () => (
      <div class="mt-8 sm:mt-28">
        <h1 class="player-title">
          <router-link to="/musics">
            我的私人音乐坊 &gt;
          </router-link>
        </h1>
        <div
          class="flex items-center mt-6 flex-col-reverse sm:flex-row"
        >
          <div class="flex-1 w-full">
            <div class="flex items-center h-9 mt-6 justify-center sm:mt-0 sm:justify-start">
              <span class="text-xl text-gray-800 text">
                { currentSong.value?.title }
              </span>
              <span class="text-sm text-gray-600 ml-1">
                <i class="mx-1.5.5.5.5.5">-</i> { currentSong.value?.artist }
              </span>
            </div>
            <div class="flex items-center mt-8">
              <span class="music-time mr-1.5">
                { formatTime(currentTime.value) }
              </span>
              <ProgressBar
                class="flex-1"
                progress={progress.value}
                onProgressChanging={onProgressChanging}
                onProgressChanged={onProgressChanged}
              />
              <span class="music-time ml-1.5">
                { formatTime(currentSong.value?.duration) }
              </span>
            </div>
            <div class="player-control flex items-center justify-between mt-10">
              <currentMode.value
                class="cursor-pointer"
                theme="outline"
                size="28"
                stroke-width={3}
                fill="#4b5563"
                onClick={changeMode}
              />
              <span class="inline-flex items-center">
                <GoStart
                  class="cursor-pointer"
                  theme="outline"
                  size="32"
                  fill="#4b5563"
                  stroke-width={3}
                  onClick={prev}
                />
                <PlayPause.value
                  class="cursor-pointer ml-5"
                  theme="outline"
                  size="40"
                  fill="#4b5563"
                  stroke-width={3}
                  onClick={togglePlay}
                />
                <GoEnd
                  class="cursor-pointer ml-5"
                  theme="outline"
                  size="32"
                  fill="#4b5563"
                  stroke-width={3}
                  onClick={next}
                />
              </span>
              <div class="inline-flex items-center ">
                <Volume.value
                  theme="outline"
                  size="16"
                  fill="#4b5563"
                />
                <div class="w-16 ml-1.5">
                  <ProgressBar
                    progress={volume.value}
                    onProgressChanging={onVolumeChange}
                    onProgressChanged={onVolumeChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="w-[180px] h-[180px] sm:ml-5">
            <div
              v-show="currentSong"
              ref={cdRef}
            >
              <img
                ref={cdCoverRef}
                class={'w-full h-full rounded-full ' + cdClass}
                src={currentSong.value?.cover}
                alt={currentSong.value?.title}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
})
