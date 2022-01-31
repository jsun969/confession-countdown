import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
  const date = process.env.DATE;
  let name;
  if (dayjs(date, 'YYYY-MM-DD HH:mm:ss').isBefore(dayjs())) {
    name = process.env.TA;
  } else {
    name = '???';
  }
  return { props: { name, date } };
};
