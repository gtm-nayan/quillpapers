declare const subjects: Record<
	string,
	{
		name: string;
		notes: string;
		topics: Record<
			string,
			{
				title: string;
				count: number;
			}
		>;
	}
>;
export default subjects;
