import UrlForm from "@/components/url-form";
import { Balancer } from "react-wrap-balancer";

export default function Home() {
  return (
    <section className="px-4 md:px-8 flex w-full flex-col gap-7 items-center relative mb-4 justify-center py-[22vh] pt-[18vh] sm:pt-[20vh]">
      <div className="hidden sm:flex">
        <Balancer
          as="h1"
          className="px-6 text-center font-sans text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl lg:font-heading lg:text-6xl lg:tracking-normal"
        >
          <p className="relative inline-block">
            <span className="z-0 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text pb-1 text-transparent dark:from-white dark:to-white">
              Read and Manage
            </span>
          </p>{" "}
          {""}
          Premium <br /> Medium Articles for {""}
          <span className="z-0 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text pb-1 text-transparent dark:from-white dark:to-white">
            Free
          </span>
        </Balancer>
      </div>
      <div className="sm:hidden">
        <Balancer
          as="h1"
          className="sm:hidden px-6 text-center font-sans text-4xl font-bold tracking-tight drop-shadow-sm sm:text-5xl lg:font-heading lg:text-6xl lg:tracking-normal"
        >
          Read and Manage Premium Medium Articles for Free
        </Balancer>{" "}
      </div>
      <Balancer className="max-w-[40rem] px-6 text-center leading-normal text-muted-foreground sm:leading-8">
        An open source tool for accessing premium Medium articles, bypassing
        paywalls, and managing your reading across devices.
      </Balancer>

      <UrlForm />
    </section>
  );
}
