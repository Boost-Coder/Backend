import { Injectable } from '@nestjs/common';
import axios from 'axios';

const URL = 'https://solved.ac/api/v3/user/show?handle=';
@Injectable()
export class AlgorithmService {
    async getBOJInfo(boj_id: string) {
        try {
            const res = await axios.get(URL + boj_id);
            const boj_info = res.data;
            return {
                rating: boj_info.rating,
                tier: boj_info.tier,
                solvedCount: boj_info.solvedCount,
            };
        } catch (e) {
            throw new Error('BOJ ID Not Found');
        }
    }
}
