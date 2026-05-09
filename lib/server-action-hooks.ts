"use client";

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { setupServerActionHooks } from "zsa-react-query";

export const { useServerActionMutation } = setupServerActionHooks({
  hooks: {
    useInfiniteQuery,
    useMutation,
    useQuery,
  },
});
