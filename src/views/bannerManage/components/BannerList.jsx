import React, { useEffect } from 'react';
import { Switch, Skeleton, Empty } from 'antd';
import { useSpring, animated } from '@react-spring/web';
import { useBannerStore } from '../../../store/bannerStore';
import Swal from 'sweetalert2';
import { formatDate } from '../../utils';
import { useNavigate } from 'react-router-dom';

export const BannerList = ({ dateRange }) => {
    const navigate = useNavigate();
    const { bannerData, loading, fetchBanner, deleteBanner, updateBannerSwitch } = useBannerStore();

    useEffect(() => {
        fetchBanner();
    }, []);

    const filteredData = dateRange
        ? bannerData.filter(item => {
            const createdAt = dayjs(item.createdAt);
            return createdAt.isAfter(dateRange[0]) && createdAt.isBefore(dateRange[1]);
        })
        : bannerData;

    const springs = useSpring({
        opacity: 1,
        transform: 'translateY(0)',
        from: { opacity: 0, transform: 'translateY(20px)' },
        config: { duration: 300, friction: 20 },
    });


    return (
        <div className=' sm:mt-5 xl:mt-10'>
            <p className='text-[14px]'>
                ທັງໝົດ {filteredData.length} ລາຍການ
            </p>
            <hr className='mt-3 sm:mb-5 xl:mb-10 border border-[#D9D9D9]' />
            <div className='grid grid-cols-12 sm:gap-5 md:gap-7 lg:gap-5 xl:gap-10'>
                {loading ? (
                    Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="h-[330px] col-span-3">
                            <Skeleton active avatar />
                        </div>
                    ))
                ) : filteredData.length < 1 ? (
                    <div className="col-span-12 h-full w-full flex items-center justify-center">
                        <Empty description="ບໍ່ມີຂໍ້ມູນ Banner" />
                    </div>
                ) : (
                    filteredData.map((item, index) => (
                        <animated.div
                            key={index}
                            className="h-[330px] xl:w-full lg:w-[220px] sm:w-[210px] md:w-[250px] relative rounded-lg sm:col-span-6 lg:col-span-4 xl:col-span-3 shadow-[4px_4px_6px_0px_#B5BABE40] bg-white"
                            style={{ ...springs }}
                        >
                            <img
                                src={`https://saiyfonbroker.s3.ap-southeast-1.amazonaws.com/images/${item?.image}`}
                                alt={item?.title}
                                className="w-full h-[190px] md:h-[200px] rounded-t-lg object-cover"
                            />
                            <div className="flex flex-col gap-y-1 pt-2 px-3 lg:px-3 xl:px-5">
                                <h4 className="text-[16px] font-medium text-ellipsis break-words line-clamp-2 ">
                                    {item?.title}
                                </h4>
                                <p className="text-[#6B7280] overflow-hidden text-ellipsis line-clamp-2">
                                    {item?.detail}
                                </p>
                            </div>
                            <div className="flex flex-col w-full absolute bottom-3 justify-between sm:px-3 xl:px-5">
                                <span className=' mb-1'>
                                    {formatDate(item?.createdAt)}
                                </span>
                                <div className=' flex items-center justify-between w-full'>
                                    <Switch
                                        onChange={(value) => updateBannerSwitch(item.id, value)}
                                        defaultChecked={item.isPublished}
                                        className="custom-switch"
                                    />
                                    <div className="flex items-center gap-x-3">
                                        <button
                                            onClick={() => deleteBanner(item.id)}
                                            className="w-[45px] bg-[#F87171] text-white rounded-full text-[10px] py-1"
                                        >
                                            ລົບ
                                        </button>
                                        <button
                                            onClick={() => navigate(`/bannerManagement/formEditBanner/${item.id}`)}
                                            className="w-[45px] bg-[#4ADE80] text-white rounded-full text-[10px] py-1"
                                        >
                                            ແກ້ໄຂ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </animated.div>
                    ))
                )}
            </div>
        </div>
    );
};
