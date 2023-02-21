import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const topicRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      console.log({ _: "topic.create", input, user: ctx.session.user.id });
      return ctx.prisma.topic.create({
        data: { title: input.title, userId: ctx.session.user.id },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    console.log({ _: "topic.getAll", user: ctx.session.user.id });

    return ctx.prisma.topic.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        user: true,
      },
    });
  }),

  reset: protectedProcedure.mutation(({ ctx }) => {
    return ctx.prisma.topic.deleteMany({
      where: { userId: ctx.session.user.id },
    });
  }),
});
