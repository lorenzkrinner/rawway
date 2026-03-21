import { KeyIcon, SpeakerWaveIcon } from "@heroicons/react/24/solid";
import { KeyboardSoundTest } from "~/types/keyboard";

export default function SoundTest({
  soundTest,
}: {
  soundTest: KeyboardSoundTest;
}) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-16 md:py-24 items-start justify-start w-full">
      <h2 className="text-start text-4xl font-medium font-loud mb-4 max-w-xl">
        {soundTest.section_title}
      </h2>
      <div className="flex flex-col w-full rounded-4xl bg-muted overflow-hidden border border-border">
        <iframe src={soundTest.video_url} className="aspect-video w-full" />
        <div className="flex gap-2 p-4 items-center justify-around">
          {soundTest.decibel_range && (
            <div className="flex items-center gap-2">
              <SpeakerWaveIcon className="size-4" />
              <p className="text-sm font-medium">Decibel range:</p>
              <p className="text-sm text-muted-foreground">
                {soundTest.decibel_range}
              </p>
            </div>
          )}
          {soundTest.switch_type && (
            <div className="flex items-center gap-2">
              <KeyIcon className="size-4" />
              <p className="text-sm font-medium">Switch type:</p>
              <p className="text-sm text-muted-foreground">
                {soundTest.switch_type}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
