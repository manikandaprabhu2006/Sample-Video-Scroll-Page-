import { useEffect, useRef } from "react";

export default function App() {
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const targetTimeRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    const section = video?.closest("[data-scroll-video]");

    if (!video || !section) return;

    const setVideoFrame = () => {
      rafRef.current = null;

      if (
        !video.duration ||
        !Number.isFinite(video.duration)
      ) {
        return;
      }

      const target = targetTimeRef.current;

      if (Math.abs(video.currentTime - target) > 0.01) {
        video.currentTime = target;
      }
    };

    const handleScroll = () => {
      if (
        !video.duration ||
        !Number.isFinite(video.duration)
      ) {
        return;
      }

      const rect = section.getBoundingClientRect();

      /*
       * 300vh section
       *
       * Hero itself = 100vh
       * Scroll-controlled video area = 200vh
       *
       * Therefore:
       *
       * 1 viewport scroll  = 50% video
       * 2 viewport scroll  = 100% video
       */

      const scrollDistance =
        section.offsetHeight - window.innerHeight;

      if (scrollDistance <= 0) return;

      let progress =
        -rect.top / scrollDistance;

      progress = Math.max(
        0,
        Math.min(1, progress)
      );

      /*
       * 5 second video:
       *
       * progress 0   = 0 sec
       * progress 0.5 = 2.5 sec
       * progress 1   = 5 sec
       */

      targetTimeRef.current =
        progress * video.duration;

      if (!rafRef.current) {
        rafRef.current =
          requestAnimationFrame(setVideoFrame);
      }
    };

    const handleMetadata = () => {
      video.pause();
      video.currentTime = 0;
      handleScroll();
    };

    video.addEventListener(
      "loadedmetadata",
      handleMetadata
    );

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    window.addEventListener(
      "resize",
      handleScroll
    );

    video.pause();

    /*
     * Force first frame
     */
    if (video.readyState >= 1) {
      video.currentTime = 0;
      handleScroll();
    }

    return () => {
      video.removeEventListener(
        "loadedmetadata",
        handleMetadata
      );

      window.removeEventListener(
        "scroll",
        handleScroll
      );

      window.removeEventListener(
        "resize",
        handleScroll
      );

      if (rafRef.current) {
        cancelAnimationFrame(
          rafRef.current
        );
      }
    };
  }, []);

  return (
    <main className="bg-black text-white">

      {/* ==================================================
          5 SECOND SCROLL VIDEO
          2 VIEWPORT SCROLLS = FULL VIDEO
          ================================================== */}

      <section
        data-scroll-video
        className="relative h-[300vh]"
      >
        <div
          className="
            sticky
            top-0
            h-screen
            w-full
            overflow-hidden
            bg-black
          "
        >

          <video
            ref={videoRef}
            src="/scroll-video.mp4"
            muted
            playsInline
            preload="auto"
            poster="/hero-poster.png"
            className="
              absolute
              inset-0
              h-full
              w-full
              object-cover
            "
          />

          {/* Dark cinematic overlay */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-black/20
            "
          />

          {/* Bottom gradient */}
          <div
            className="
              pointer-events-none
              absolute
              inset-x-0
              bottom-0
              h-[45%]
              bg-gradient-to-t
              from-black/80
              via-black/30
              to-transparent
            "
          />

          {/* Hero content */}
          <div
            className="
              absolute
              inset-0
              z-10
              flex
              items-end
              justify-center
              px-6
              pb-[14vh]
              text-center
            "
          >
            <div className="max-w-5xl">

              <p
                className="
                  mb-4
                  text-[10px]
                  uppercase
                  tracking-[0.45em]
                  text-white/75
                  sm:text-xs
                "
              >
                Est. Tirunelveli
              </p>

              <h1
                className="
                  text-[15vw]
                  font-light
                  leading-[0.82]
                  tracking-[-0.04em]
                  sm:text-[11vw]
                  md:text-[8vw]
                  lg:text-[6.5vw]
                "
              >
                Timeless
                <br />
                Style
              </h1>

              <div
                className="
                  mx-auto
                  mt-6
                  h-px
                  w-16
                  bg-white/70
                  sm:w-24
                "
              />

              <p
                className="
                  mt-5
                  text-[11px]
                  uppercase
                  tracking-[0.28em]
                  text-white/85
                  sm:text-sm
                "
              >
                Men&apos;s Retro Wear
              </p>

            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="
              absolute
              bottom-7
              left-1/2
              z-20
              -translate-x-1/2
              text-center
            "
          >
            <span
              className="
                block
                text-[8px]
                uppercase
                tracking-[0.4em]
                text-white/60
              "
            >
              Scroll
            </span>

            <div
              className="
                mx-auto
                mt-2
                h-8
                w-px
                bg-gradient-to-b
                from-white/70
                to-transparent
              "
            />
          </div>

        </div>
      </section>


      {/* ==================================================
          AFTER VIDEO
          ================================================== */}

      <section
        className="
          flex
          min-h-screen
          items-center
          justify-center
          px-6
          py-32
          text-center
        "
      >
        <div className="max-w-3xl">

          <p
            className="
              text-xs
              uppercase
              tracking-[0.4em]
              text-white/40
            "
          >
            Retro Clothing
          </p>

          <h2
            className="
              mt-6
              text-4xl
              font-light
              tracking-tight
              sm:text-6xl
              md:text-7xl
            "
          >
            Style that never
            <br />
            goes out of time.
          </h2>

          <p
            className="
              mx-auto
              mt-8
              max-w-xl
              text-sm
              leading-7
              text-white/50
              sm:text-base
            "
          >
            Timeless silhouettes, refined details and
            everyday comfort — crafted for the modern
            man with a taste for classic style.
          </p>

        </div>
      </section>


      {/* ==================================================
          COLLECTION
          ================================================== */}

      <section
        className="
          border-t
          border-white/10
          px-6
          py-32
          sm:py-40
        "
      >
        <div className="mx-auto max-w-7xl">

          <div
            className="
              mb-16
              flex
              flex-col
              justify-between
              gap-5
              sm:flex-row
              sm:items-end
            "
          >

            <div>

              <p
                className="
                  text-xs
                  uppercase
                  tracking-[0.4em]
                  text-white/40
                "
              >
                The Collection
              </p>

              <h2
                className="
                  mt-4
                  text-4xl
                  font-light
                  sm:text-6xl
                "
              >
                Made for now.
              </h2>

            </div>

            <p
              className="
                max-w-sm
                text-sm
                leading-6
                text-white/40
              "
            >
              A modern interpretation of classic
              menswear, designed around timeless
              everyday style.
            </p>

          </div>


          <div
            className="
              grid
              gap-px
              overflow-hidden
              bg-white/10
              sm:grid-cols-3
            "
          >

            <div className="bg-black p-8 sm:p-10">
              <span className="text-xs text-white/30">
                01
              </span>

              <h3
                className="
                  mt-24
                  text-2xl
                  font-light
                "
              >
                Shirts
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  text-white/40
                "
              >
                Classic cuts. Modern attitude.
              </p>
            </div>


            <div className="bg-black p-8 sm:p-10">
              <span className="text-xs text-white/30">
                02
              </span>

              <h3
                className="
                  mt-24
                  text-2xl
                  font-light
                "
              >
                Tees
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  text-white/40
                "
              >
                Everyday essentials, refined.
              </p>
            </div>


            <div className="bg-black p-8 sm:p-10">
              <span className="text-xs text-white/30">
                03
              </span>

              <h3
                className="
                  mt-24
                  text-2xl
                  font-light
                "
              >
                Pants
              </h3>

              <p
                className="
                  mt-3
                  text-sm
                  text-white/40
                "
              >
                Built around timeless proportions.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* ==================================================
          CTA
          ================================================== */}

      <section
        className="
          flex
          min-h-[80vh]
          items-center
          justify-center
          border-t
          border-white/10
          px-6
          text-center
        "
      >
        <div>

          <p
            className="
              text-xs
              uppercase
              tracking-[0.4em]
              text-white/40
            "
          >
            Retro Clothing · Tirunelveli
          </p>

          <h2
            className="
              mt-6
              text-5xl
              font-light
              tracking-tight
              sm:text-7xl
              md:text-8xl
            "
          >
            Luxury.
            <br />
            Made Affordable.
          </h2>

          <button
            type="button"
            className="
              mt-10
              border
              border-white/30
              px-8
              py-4
              text-xs
              uppercase
              tracking-[0.3em]
              transition
              duration-300
              hover:bg-white
              hover:text-black
            "
          >
            Explore Collection
          </button>

        </div>
      </section>


      {/* ==================================================
          FOOTER
          ================================================== */}

      <footer
        className="
          border-t
          border-white/10
          px-6
          py-8
          text-center
        "
      >
        <p
          className="
            text-[10px]
            uppercase
            tracking-[0.3em]
            text-white/30
          "
        >
          Retro Clothing · Tirunelveli
        </p>
      </footer>

    </main>
  );
}