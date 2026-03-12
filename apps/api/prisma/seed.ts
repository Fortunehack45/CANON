import { PrismaClient } from '@prisma/client';
import { ulid } from 'ulid';

const prisma = new PrismaClient();

async function main() {
  const orgId = ulid();
  const userId = ulid();

  const org = await prisma.organization.upsert({
    where: { id: orgId },
    update: {},
    create: {
      id: orgId,
      name: 'Acme Corp',
      settings: {},
    },
  });

  const user = await prisma.user.upsert({
    where: { id: userId },
    update: {},
    create: {
      id: userId,
      orgId: org.id,
      email: 'engineer@acme.com',
      name: 'John Doe',
      role: 'engineer',
    },
  });

  console.log({ org, user });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
