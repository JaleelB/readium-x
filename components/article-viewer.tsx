"use client";

import { useZoom } from "@/hooks/use-zoom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import { MagnificationController } from "./magnification-controller";
import {
  CustomHeading,
  CustomBlockquote,
  CustomCodeBlock,
  CustomImage,
  CustomFigcaption,
  CustomFigure,
  CustomParagraph,
  CustomEmphasis,
  CustomStrong,
  CustomLink,
  CustomDiv,
  CustomUL,
  CustomLI,
  CustomOL,
} from "@/lib/tiptap-extensions";

function literalTemplate(
  strings: TemplateStringsArray,
  ...values: any[]
): string {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (values[i] || "");
  });
  return str;
}

function forceReflow(element: HTMLElement) {
  element.offsetHeight; // Reading offsetHeight to force reflow
}

export function ArticleViewer({ content }: { content: string }) {
  const staticHTMLContent = literalTemplate`${content}`;

  const editor = useEditor({
    content: staticHTMLContent,
    //   <div class="main-content mt-8">
    //         <p class="leading-8 mt-7"><a href="https://react.dev/blog/2024/04/25/react-19" title="" rel="" style="text-decoration: underline;">React 19 beta has landed</a>, bringing along some unique updates and features to the React ecosystem. In today's article, we'll be taking a look into some of the new Hooks &amp; APIs React 19 brings, shedding light on how some of these changes can improve how we develop our React applications moving forward.</p><p class="leading-8 mt-7"><em>This article marks the first informative issue we've sent out to the "</em><a href="https://largeapps.substack.com/" title="" rel="" style="text-decoration: underline;"><em>Building Large Scale Apps</em></a><em>" newsletter community. In the newsletter, we share content on building and maintaining large-scale web applications, with a focus on front-end engineering and JavaScript technologies.</em></p><p class="leading-8 mt-7"><em>Some content we share will focus more on exploring code changes and API enhancements (like this article!), while other content will dive into sharing experiences, case studies, or insightful anecdotes from seasoned engineers in the industry working with large-scale web apps.</em></p><p class="leading-8 mt-7"><em>To get issues like this in your inbox, be sure to subscribe!</em></p><blockquote class="mt-7 text-2xl ml-5 text-gray-600 dark:text-gray-300"><p><a href="https://largeapps.substack.com/" title="" rel="nofollow" style="text-decoration: underline;">https://largeapps.substack.com/</a></p></blockquote><h3 class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-1xl md:text-2xl pt-12">React 19</h3><p class="leading-8 mt-3">React 19 has made an entrance into the scene on April 25, 2024, with its official <a href="https://react.dev/blog/2024/04/25/react-19" title="" rel="" style="text-decoration: underline;">beta release</a>. This new version comes packed with a slew of changes including new Hooks &amp; APIs, React Server Components, the removal of some deprecated React APIs, and a lot more. In today's issue, we'll be primarily focusing on exploring some of the exciting new Hooks &amp; APIs that React 19 introduces.</p><p class="leading-8 mt-7">Keep in mind React 19 is still in beta to primarily target library developers to experiment with and adapt their libraries for the upcoming changes. General app developers are encouraged to upgrade to React 18.3 and await React 19's stable release. For more details and information on upgrading to React 19, the React team has laid out a great <a href="https://react.dev/blog/2024/04/25/react-19-upgrade-guide" title="" rel="" style="text-decoration: underline;">React 19 Beta Upgrade Guide</a> that you can check out.</p><h3 class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-1xl md:text-2xl pt-12">Form submissions and optimistic updates</h3><p class="leading-8 mt-3">A large part of how we use web applications today involves interacting with forms for various purposes, from user authentication to data submission to e-commerce transactions, feedback collection, search queries, and much more. As a result, a very common behavior in React component development involves making form submissions of a sort and handling the asynchronous updates of what the form should do when submitted.</p><p class="leading-8 mt-7">A simple example of a form component handling such async updates can look something like the following:</p><div class="mt-7"><img data-src="https://miro.medium.com/v2/resize:fit:700/0*fC2tyYdTbu-ToPOZ.png" role="presentation" class="pt-5 lazy m-auto" alt="None"></div><p class="leading-8 mt-7">In the above example, the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">Component</code> manages a form's state and handles form submission asynchronously. Upon submission, the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">submitForm()</code> function submits the form information to a server and returns a response. The component updates its state accordingly, displaying feedback to the user about the submission process.</p><p class="leading-8 mt-7">In React 18, this concept of transitioning the UI from one view to another in a non-urgent manner was given the name of <a href="https://react.dev/blog/2022/03/29/react-v18#new-feature-transitions" title="" rel="" style="text-decoration: underline;">transitions</a>. React 19 now supports using async functions in transitions where the <a href="https://react.dev/reference/react/useTransition" title="" rel="" style="text-decoration: underline;">useTransition</a> Hook can also be leveraged to manage the rendering of loading indicators or placeholders during asynchronous data fetching.</p><h3 class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-1xl md:text-2xl pt-12">Actions</h3><p class="leading-8 mt-3">In React 19, the concept of transitions is taken a step further as functions that use <em>async</em> transitions are now referred to as <strong>Actions</strong>. There now exist a few specialized Hooks to manage Actions like what we've seen above and the first we'll take a look at is the <strong><a href="https://react.dev/reference/react/useActionState" title="" rel="" style="text-decoration: underline;">useActionState</a></strong> Hook.</p><h4 class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-l md:text-xl pt-8"><code class="p-1.5 bg-gray-300 dark:bg-gray-600">useActionState</code></h4><p class="leading-8 mt-3">The <code class="p-1.5 bg-gray-300 dark:bg-gray-600">useActionState()</code> Hook accepts three parameters:</p><ol class="list-decimal pl-8 mt-2"><li class="mt-3">An "action" function, which is executed when the form action is triggered.</li><li class="mt-3">An initial state object, that sets the starting state of the form before any user interaction.</li><li class="mt-3">[Optional] A permalink that refers to the unique page URL that this form modifies.</li></ol><p class="leading-8 mt-7">And returns three values in a tuple:</p><ol class="list-decimal pl-8 mt-2"><li class="mt-3">The current state of the form.</li><li class="mt-3">A function to trigger the form action.</li><li class="mt-3">A boolean indicating whether the action is pending.</li></ol><div class="mt-7"><img data-src="https://miro.medium.com/v2/resize:fit:700/0*CcYFDNnD9w9YhCHB.png" role="presentation" class="pt-5 lazy m-auto" alt="None"></div><p class="leading-8 mt-7">The <code class="p-1.5 bg-gray-300 dark:bg-gray-600">action</code> function passed down as the first argument to the useActionState Hook is triggered when the form submits and returns the form state we expect to transition to when the form submission is either successful or encounters errors. The function receives two parameters — the current state of the form and form data the moment the action was triggered.</p><p class="leading-8 mt-7">Here's an example of creating an <code class="p-1.5 bg-gray-300 dark:bg-gray-600">action()</code> function that calls a hypothetical <code class="p-1.5 bg-gray-300 dark:bg-gray-600">submitForm()</code> function that subsequently triggers an API call to submit the form data to a server. When the action is successful, it returns a form state object representing the next state of the form. When the action fails, it returns a form state object reflecting the error state, possibly including error messages or indicators to guide the user in correcting the issue.</p><div class="mt-7"><img data-src="https://miro.medium.com/v2/resize:fit:700/0*2sjNPmZFuhIXVVqS.png" role="presentation" class="pt-5 lazy m-auto" alt="None"></div><p class="leading-8 mt-7">With our <code class="p-1.5 bg-gray-300 dark:bg-gray-600">useActionState()</code> Hook set-up, we're then able to use the form <code class="p-1.5 bg-gray-300 dark:bg-gray-600">state</code>, <code class="p-1.5 bg-gray-300 dark:bg-gray-600">dispatch</code>, and <code class="p-1.5 bg-gray-300 dark:bg-gray-600">isPending</code> values in our form template.</p><h4 class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-l md:text-xl pt-8"><code class="p-1.5 bg-gray-300 dark:bg-gray-600">&lt;form&gt;</code> actions</h4><p class="leading-8 mt-3">With React 19, <code class="p-1.5 bg-gray-300 dark:bg-gray-600">&lt;form&gt;</code> elements now have an <code class="p-1.5 bg-gray-300 dark:bg-gray-600">action</code> prop that can receive an action function that will be triggered when a form is submitted. Here is where we'll pass down the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">dispatch</code> function from our <code class="p-1.5 bg-gray-300 dark:bg-gray-600">useActionState()</code> Hook.</p><div class="mt-7"><img data-src="https://miro.medium.com/v2/resize:fit:700/0*1Krk9YW8HT8LEkOZ.png" role="presentation" class="pt-5 lazy m-auto" alt="None"></div><p class="leading-8 mt-7">We can display the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">state</code> somewhere in our form template and use the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">isPending</code> value to convey to the user when the async action is in flight.</p><div class="mt-7"><img data-src="https://miro.medium.com/v2/resize:fit:700/0*M_rynTTYsa9R6vOK.png" role="presentation" class="pt-5 lazy m-auto" alt="None"></div><p class="leading-8 mt-7">Voila! With these new changes to React, we no longer need to handle pending states, errors, and sequential requests manually when working with async transitions in forms. Instead, these values are accessed directly from the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">useActionState()</code> Hook.</p><blockquote class="px-5 pt-3 pb-3 mt-5" style="box-shadow: inset 3px 0 0 0 rgb(209 207 239 / var(--tw-bg-opacity));"><p class="font-italic"><em>Here's a more detailed Github Gist of the above example that interacts with the publicly available </em><a href="https://dummyjson.com/" title="" rel="" style="text-decoration: underline;"><em>dummyjson</em></a><em> API — </em><strong><em><a href="https://gist.github.com/djirdehh/a1e03a717b5c4555a3c99a8e620eb77d" title="" rel="" style="text-decoration: underline;">Github Gist</a></em></strong><em>.</em></p></blockquote><h4 class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-l md:text-xl pt-8"><code class="p-1.5 bg-gray-300 dark:bg-gray-600">useFormStatus</code></h4><p class="leading-8 mt-3">React 19 introduces another new Hook titled <strong><a href="https://react.dev/reference/react-dom/hooks/useFormStatus" title="" rel="" style="text-decoration: underline;">useFormStatus</a></strong> that allows nested child components to access information about the form they're situated in (just like if the form was a context provider).</p><div class="mt-7"><img data-src="https://miro.medium.com/v2/resize:fit:700/0*A54CtqwGN-Va2hXJ.png" role="presentation" class="pt-5 lazy m-auto" alt="None"></div><p class="leading-8 mt-7">Though the behavior of accessing parent form information can be done via Context, React 19 introduces the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">useFormStatus</code> Hook to make the common case of handling form data within nested components much easier.</p><h4 class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-l md:text-xl pt-8"><code class="p-1.5 bg-gray-300 dark:bg-gray-600">useOptimistic</code></h4><p class="leading-8 mt-3">The <code class="p-1.5 bg-gray-300 dark:bg-gray-600">useOptimistic()</code> Hook is another new Hook in React 19. It allows us to perform optimistic updates while a background operation, like a network request, completes. This can improve the user experience by providing a faster response to user interactions.</p><p class="leading-8 mt-7">Below is an example of using the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">useOptimistic()</code> Hook to manage optimistic updates for a <code class="p-1.5 bg-gray-300 dark:bg-gray-600">message</code> state property being passed in as props.</p><div class="mt-7"><img data-src="https://miro.medium.com/v2/resize:fit:700/0*VFsg11YC0W5vljXr.png" role="presentation" class="pt-5 lazy m-auto" alt="None"></div><p class="leading-8 mt-7">In the above component example, the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">useOptimistic</code> Hook is used to manage optimistic updates of the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">message</code> state being passed down as a prop.</p><p class="leading-8 mt-7">When the user submits the form by clicking the "Add Message" button, the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">submitForm()</code> function is triggered. Before initiating the API request to update the message, the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">setOptimisticMessage()</code> function is called with the new message value obtained from the form data. This immediately updates the UI to reflect the optimistic change, providing the user with instant feedback.</p><p class="leading-8 mt-7">When the update finishes or errors, React will automatically switch back to the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">message</code> prop value.</p><h3 class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-1xl md:text-2xl pt-12">The new use API</h3><p class="leading-8 mt-3">React 19 introduces a new <strong><a href="https://react.dev/reference/react/use" title="" rel="" style="text-decoration: underline;">use</a></strong> API as a versatile way to read values from resources like Promises or context.</p><p class="leading-8 mt-7">For instance, to read context values, we simply pass the context to <code class="p-1.5 bg-gray-300 dark:bg-gray-600">use()</code>, and the function traverses the component tree to find the closest context provider.</p><div class="mt-7"><img data-src="https://miro.medium.com/v2/resize:fit:700/0*zztWuLdrBAImkSy_.png" role="presentation" class="pt-5 lazy m-auto" alt="None"></div><p class="leading-8 mt-7">Unlike the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">useContext()</code> Hook to read context, the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">use()</code> function can be used within conditionals and loops in our components!</p><div class="mt-7"><img data-src="https://miro.medium.com/v2/resize:fit:700/0*IS_DUO6Cz6xNIQ88.png" role="presentation" class="pt-5 lazy m-auto" alt="None"></div><p class="leading-8 mt-7"><code class="p-1.5 bg-gray-300 dark:bg-gray-600">use()</code> also integrates seamlessly with <code class="p-1.5 bg-gray-300 dark:bg-gray-600">Suspense</code> and error boundaries, to read promises (see more in <a href="https://react.dev/reference/react/use#streaming-data-from-server-to-client" title="" rel="" style="text-decoration: underline;">Streaming data from the server to the client</a> of React docs).</p><h3 class="font-bold font-sans break-normal text-gray-900 dark:text-gray-100 text-1xl md:text-2xl pt-12">React Server Components</h3><p class="leading-8 mt-3"><a href="https://react.dev/reference/rsc/server-components" title="" rel="" style="text-decoration: underline;">React Server Components</a> are a new capability being introduced in React 19 that allows us to create stateless React components that <em>run on the server</em>. These components run ahead of time and before bundling in an environment different from the client application (or server-side-rendered server).</p><p class="leading-8 mt-7">Since React Server Components are able to run on a web server, they can be used to access the data layer without having to interact with an API!</p><div class="mt-7"><img data-src="https://miro.medium.com/v2/resize:fit:700/0*VEjMWesiuNqdAngi.png" role="presentation" class="pt-5 lazy m-auto" alt="None"></div><p class="leading-8 mt-7">How cool is that! With this, we don't have to expose an API endpoint or use additional client-side fetching logic to load data directly into our components. All the data handling is done on the server.</p><p class="leading-8 mt-7">Keep in mind that Server Components are run on the server and not the browser. As a result, they're unable to use traditional React component APIs like <code class="p-1.5 bg-gray-300 dark:bg-gray-600">useState</code>. To introduce interactivity to a React Server Component setting, we'll need to leverage Client Components that complement the Server Components for handling interactivity.</p><p class="leading-8 mt-7">To continue the above blog-post example, this can look something like having the <code class="p-1.5 bg-gray-300 dark:bg-gray-600">Comment</code> component being rendered to be a Client component that includes some state and interactivity.</p><div class="mt-7"><img data-src="https://miro.medium.com/v2/resize:fit:700/0*XgUSb6xBkAMCL7rB.png" role="presentation" class="pt-5 lazy m-auto" alt="None"></div><p class="leading-8 mt-7">Notice the declaration of "use client" at the top of the component file in the example above. When working with React Server Components, "<a href="https://react.dev/reference/rsc/use-client" title="" rel="" style="text-decoration: underline;">use client</a>" denotes that the component is a Client Component, which means it can manage state, handle user interactions, and use browser-specific APIs. This directive explicitly tells the React framework and bundler to treat this component differently from Server Components, which are stateless and run on the server.</p><p class="leading-8 mt-7">On the flip-side, React Server Components are the default so we don't state "use server" at the top of Server Component files. Instead, "use server" should only be used to mark server-side functions that can be called from Client Components. These are called <a href="https://react.dev/reference/rsc/use-server" title="" rel="" style="text-decoration: underline;">Server Actions</a>.</p><p class="leading-8 mt-7">React Server Components change how we structure our React applications by separating concerns between client and server. The React team believes they will eventually be widely adopted and change the way we build React applications. At this very moment, we're currently working on a full deep-dive into React Server Components as part of the new chapter "React in 2024" that we'll be adding to the "<a href="https://largeapps.dev/" title="" rel="" style="text-decoration: underline;">Building Large Scale Web Apps</a>" book. We'll have more to share on this later!</p><p class="leading-8 mt-7"><em>Enjoyed this article? Be sure to subscribe to get this newsletter directly in your inbox @ </em><a href="https://largeapps.substack.com/" title="" rel="nofollow" style="text-decoration: underline;">https://largeapps.substack.com</a>.</p><p class="leading-8 mt-7">For more details on the new features in React 19 and how you can begin trying out the beta, be sure to check out the <a href="https://react.dev/blog/2024/04/25/react-19" title="" rel="" style="text-decoration: underline;">React 19 Beta</a> documentation from the official React docs.</p>
    //     </div>
    // `,
    editable: false, // Make it non-editable initially
    extensions: [
      // StarterKit.configure({
      //   heading: false,
      //   codeBlock: false,
      //   bulletList: false,
      //   orderedList: false,
      //   blockquote: false,
      //   listItem: false,
      //   paragraph: false,
      // }),
      Document,
      Text,
      CustomHeading(1),
      CustomHeading(2),
      CustomHeading(3),
      CustomHeading(4),
      CustomHeading(5),
      CustomHeading(6),
      CustomBlockquote,
      CustomCodeBlock,
      CustomImage,
      CustomFigcaption,
      CustomFigure,
      CustomParagraph,
      CustomEmphasis,
      CustomStrong,
      CustomLink,
      CustomDiv,
      CustomUL,
      CustomOL,
      CustomLI,
      // RawHTML,
    ],
    editorProps: {
      attributes: {
        class: "prose dark:prose-dark",
      },
    },
    onUpdate: ({ editor }) => {
      forceReflow(editor.view.dom);
    },
  });

  const { zoom, zoomIn, zoomOut, resetZoom } = useZoom();

  return (
    <div className="prose dark:prose-dark">
      <EditorContent
        editor={editor}
        style={{ zoom: zoom, transition: "zoom 0.2s" }}
      />
      <MagnificationController
        zoom={zoom}
        zoomIn={zoomIn}
        zoomOut={zoomOut}
        resetZoom={resetZoom}
      />
    </div>
  );
}
