import {test, expect } from '@playwright/test';

const requestBody = {
            firstname: 'Axeezz',
            lastname: 'Cold',
            totalprice: 245,
            depositpaid: false,
            bookingdates: {
                checkin: '2026-05-05',
                checkout: '2026-05-21',
            },
            additionalneeds: '',    
            };

const updateRequestBody = {
            firstname: 'Alex',
            lastname: 'Cold',
            totalprice: 490,
            depositpaid: false,
            bookingdates: {
                checkin: '2026-05-05',
                checkout: '2026-05-21',
            },
            additionalneeds: '',    
            };

const baseURL = 'https://restful-booker.herokuapp.com';

let bookingId;
let token;

async function getToken(request) {

    const response = await request.post(`${baseURL}/auth`, {
        data: {
            username: 'admin',
            password: 'password123',
        },
    });

    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    
    expect(responseBody).toBeDefined();

    token = responseBody.token;
}

test.describe('API-тесты для Restful_booker', () => {
    test.describe.configure({ mode: 'serial' });

    test('Создание бронирования', async ({request}) => {

        const response = await request.post(`${baseURL}/booking`, {
            data: requestBody,
        });

        const responseBody = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);        
        expect(responseBody.bookingid).toBeDefined();
        expect(responseBody.booking).toEqual(requestBody);

        bookingId = responseBody.bookingid;
    });

    test('Получение информации о бронировании', async ({request}) => {

        const response = await request.get(`${baseURL}/booking/${bookingId}`);
        const responseBody = await response.json();

        expect(response.ok()).toBeTruthy();
        expect(response.status()).toBe(200);
        expect(responseBody).toEqual(requestBody);
    })


    test('Обновление бронирования', async ({request}) => {
     
        await getToken(request);

        const response = await request.put(`${baseURL}/booking/${bookingId}`, {
            
            headers: {Cookie: `token=${token}`},
            data: updateRequestBody,
        });

        const responseBody = await response.json();

        expect(response.status()).toBe(200);
        expect(response.ok()).toBeTruthy();
        expect(responseBody).toEqual(updateRequestBody);
    });

    test('Удаление бронирования', async ({request}) => {

        let response = await request.delete(`${baseURL}/booking/${bookingId}`, {

            headers: {Cookie: `token=${token}`},
        });

        expect(response.status()).toBe(201);

        response = await request.get(`${baseURL}/booking/${bookingId}`);
        
        expect(response.status()).toBe(404);
    });
})