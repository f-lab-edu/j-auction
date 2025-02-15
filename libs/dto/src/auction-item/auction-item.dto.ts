import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

const timeOptions = {
    timeZone: 'Asia/Seoul',
    hour12: false,
};

export class AuctionItemDto {
    @ApiProperty({ description: '상품 id', example: 10 })
    @Expose()
    id: number;

    @ApiProperty({ description: '카테고리 code', example: '0001' })
    @Expose()
    c_code: string;

    @ApiProperty({
        description: '상품 제목',
        example: '경매 등록 상품 제목',
    })
    @Expose()
    title: string;

    @ApiProperty({ description: '상품 내용', example: '상품 내용 상세' })
    @Expose()
    content: string;

    @ApiProperty({
        description: '상품 이미지 url',
        example: 'https://auction-item.image.url',
    })
    @Expose()
    image: string;

    @ApiProperty({ description: '사용자 id', example: 'qwer-asdf-zcxv' })
    @Expose()
    user_id: string;

    @ApiProperty({ description: '경매 진행중 여부', example: 0 })
    @Expose()
    status: number;

    @ApiProperty({ description: '찜 수', example: 0 })
    @Expose()
    likes: number;

    @ApiProperty({
        description: '경매 시작일시',
        example: '2023-12-12 15:00:00',
    })
    @Expose()
    @Transform(({ value }) => value.toLocaleString('en-US', timeOptions))
    start_datetime: Date;

    @ApiProperty({
        description: '경매 종료일시',
        example: '2023-12-15 22:00:00',
    })
    @Expose()
    @Transform(({ value }) => value.toLocaleString('en-US', timeOptions))
    end_datetime: Date;

    @ApiProperty({
        description: '시작 가격',
        example: '10000',
    })
    @Expose()
    start_price: number;

    @ApiProperty({
        description: '현재 가격',
        example: '10000',
    })
    @Expose()
    current_price: number;

    @ApiProperty({
        description: '상품 등록 시간',
        example: '2023-12-15 22:00:00',
    })
    @Expose()
    @Transform(({ value }) => value.toLocaleString('en-US', timeOptions))
    created_at: Date;
}

export class AuctionItemListDto {
    @ApiProperty({ description: '전체 개수', example: 50 })
    @Expose()
    total: number;

    @ApiProperty({ description: '상품 개수', example: 10 })
    @Expose()
    count: number;

    @ApiProperty({ description: '상품 데이터 리스트', type: [AuctionItemDto] })
    @Expose()
    @Type(() => AuctionItemDto)
    items: AuctionItemDto[];
}
