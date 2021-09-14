import 'animate.css';
import { Box, Flex, Stack, Text } from '@chakra-ui/layout';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import clsx from 'clsx';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';

dayjs.extend(customParseFormat);

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

interface HomePageProps {
  name: string;
  date: string;
}

const HomePage: NextPage<HomePageProps> = ({ name, date }) => {
  const endDate = dayjs(date, 'YYYY-MM-DD HH:mm:ss');
  const [secondLeft, setSecondLeft] = useState<number>(endDate.diff(dayjs(), 'second'));

  enum TimeStatus {
    before,
    now,
    after,
  }
  const [timeStatus, setTimeStatus] = useState<TimeStatus>(name === '???' ? TimeStatus.before : TimeStatus.after);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSecondLeft(endDate.diff(dayjs(), 'second'));
    }, 1000);
    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (secondLeft === 0) {
      setTimeStatus(TimeStatus.now);
    }
  }, [secondLeft, TimeStatus]);

  return (
    <>
      <Head>
        <title>我喜欢你, {name}</title>
        <meta name="description" content="一个暗恋解决方案" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex alignItems="center" justifyContent="center" height="100vh" bgColor="pink.100">
          <Stack spacing={10} p={5}>
            <Box
              p={4}
              borderRadius="xl"
              bgColor="white"
              className={clsx('animate__animated', 'animate__heartBeat', 'animate__infinite')}
            >
              <Text fontSize="4xl" align="center">
                我喜欢你, <strong>{name}</strong>
              </Text>
            </Box>
            <Box p={4} borderRadius="xl" bgColor="white">
              <Text
                align="center"
                className={clsx(timeStatus === TimeStatus.now && ['animate__animated', 'animate__tada', 'animate__infinite'])}
              >
                {timeStatus === TimeStatus.before && (
                  <>
                    还有<strong>{secondLeft}秒</strong>
                  </>
                )}
                {timeStatus === TimeStatus.now && <>刷新页面!!</>}
              </Text>
              <Text align="center" fontSize="small" color="gray.500">
                显示时间: {date}
              </Text>
            </Box>
          </Stack>
        </Flex>
      </main>
    </>
  );
};

export default HomePage;
