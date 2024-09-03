import { Member } from '../../../backend/models/member.model'
import { MemberAttribute } from '../../../backend/models/memberAttribute.model'
import { generateMemberCsvData } from '../../../backend/services/memberCsv.service'

describe('MemberCsvService', () => {
	const memberDataSample = [
		{
			memberId: 1,
			memberCode: '1000001',
			displayName: 'John Doe',
			remarks: 'test',
			kakeruPoint: 100,
			createdAt: new Date(),
			memberSince: new Date(),
			activeUntil: new Date(),
			visits: [],
			memberAttributeId1: 'John Doe',
			memberAttributeId2: '4600000',
			memberAttributeId3: '愛知県',
			memberAttributeId4: '名古屋市',
			memberAttributeId5: '錦２−１２−３４',
			memberAttributeId6: 'ミライク',
			memberAttributeId7: '「これはなにか」'
		},
		{
			memberId: 2,
			memberCode: '1000002',
			displayName: 'Jane Doe',
			remarks: 'test',
			kakeruPoint: 200,
			createdAt: new Date(),
			memberSince: new Date(),
			activeUntil: new Date(),
			visits: [],
			memberAttributeId1: 'Jane Doe',
			memberAttributeId2: '4600001',
			memberAttributeId3: '愛知県',
			memberAttributeId4: '名古屋市',
			memberAttributeId5: '錦２−１２−３５',
			memberAttributeId6: 'Miraic',
			memberAttributeId7: `「あれはなにか」
「それはなにか」`
		}
	]
	const memberAttributesSample: Pick<
		MemberAttribute,
		'memberAttributeId' | 'type' | 'label' | 'section' | 'required' | 'showOrder'
	>[] = [
		{
			memberAttributeId: 1,
			type: 'text',
			label: '名前',
			section: null,
			required: true,
			showOrder: 1
		},
		{
			memberAttributeId: 2,
			type: 'address_postal',
			label: '住所１',
			section: 'test_address_1',
			required: true,
			showOrder: 2
		},
		{
			memberAttributeId: 3,
			type: 'address_prefecture',
			label: '住所１',
			section: 'test_address_1',
			required: true,
			showOrder: 2
		},
		{
			memberAttributeId: 4,
			type: 'address_city',
			label: '住所１',
			section: 'test_address_1',
			required: true,
			showOrder: 2
		},
		{
			memberAttributeId: 5,
			type: 'address_address',
			label: '住所１',
			section: 'test_address_1',
			required: true,
			showOrder: 2
		},
		{
			memberAttributeId: 6,
			type: 'address_building',
			label: '住所１',
			section: 'test_address_1',
			required: true,
			showOrder: 2
		},
		{
			memberAttributeId: 7,
			type: 'text',
			label: 'Favorite Quote',
			section: null,
			required: false,
			showOrder: 3
		}
	]
	it('should return csv with only header', async () => {
		const members: Member[] = []
		const memberAttributes: MemberAttribute[] = []
		const result = await generateMemberCsvData(members, memberAttributes)
		expect(result).toEqual(
			'\uFEFF"ID","会員コード","LINE名","備考欄","来店回数","最終来店日","ポイント","友だち登録日","会員登録日","有効期限"'
		)
	})
	it('should return csv with address fields as a single cell', async () => {
		const members: Member[] = memberDataSample.map((m, i) => {
			const member = Member.build(m)
			memberAttributesSample.forEach((a, j) => {
				// eslint-disable-next-line @typescript-eslint/no-extra-semi, security/detect-object-injection
				;(member as any)[`memberAttributeId${a.memberAttributeId}`] = (memberDataSample as any)[i][
					`memberAttributeId${a.memberAttributeId}`
				]
			})
			return member
		})
		const memberAttributes: MemberAttribute[] = memberAttributesSample.map((m) => MemberAttribute.build(m))
		const result = await generateMemberCsvData(members, memberAttributes)
		expect(result).toEqual(
			`\uFEFF"ID","会員コード","LINE名","名前","住所１","Favorite Quote","備考欄","来店回数","最終来店日","ポイント","友だち登録日","会員登録日","有効期限"
"1","1000001","John Doe","John Doe","4600000愛知県名古屋市錦２−１２−３４ミライク","「これはなにか」","test","ー回","ー","100","2024年8月29日","2024年8月29日","2024年8月29日"
"2","1000002","Jane Doe","Jane Doe","4600001愛知県名古屋市錦２−１２−３５Miraic","「あれはなにか」\n「それはなにか」","test","ー回","ー","200","2024年8月29日","2024年8月29日","2024年8月29日"`
		)
	})
})
