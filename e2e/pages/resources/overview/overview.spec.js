import OverviewPage from './overview.po.js';
import Hooks from '../../../utilities/hooks'

beforeEach(async () => {
    await Hooks.open('/resources/overview');
});

describe('Overview page', () => {

    it('should have ONC ACB ATL table', () => {
        assert.equal(OverviewPage.acbatlTable.isDisplayed(),true);
    })

    it('should have correct acb and atl in the table', () => {
        var rowcount = OverviewPage.acbatlTableRow.length;
        var colcount = OverviewPage.acbatlTableCol.length;
        var actualResult = [];
        for (var i = 1; i <= rowcount; i ++) {
            for (var j = 1; j <= colcount - 2; j ++) {
                var cellvalue = $('#acbAtlTable tbody tr:nth-child(' + i + ') td:nth-child(' + j + ')').getText();
                actualResult.push(cellvalue);
            }
        }
        const expectedTableVlaues = ['ONC-ACB', 'Drummond Group', 'ONC-ACB', 'ICSA Labs', 'ONC-ACB','SLI Compliance', 'ONC-ACB', 'UL LLC', 'ONC-ATL', 'Drummond Group', 'ONC-ATL', 'ICSA Labs', 'ONC-ATL', 'National Committee for Quality Assurance (NCQA)', 'ONC-ATL', 'SLI Compliance','ONC-ATL', 'UL LLC']
        var isSame = false;
        for ( var k = 0; k < actualResult.length; k ++) {
            if (actualResult[k] === expectedTableVlaues[k]) {
                isSame = true;
            }
        }
        assert.equal(isSame,true);
    })
})
