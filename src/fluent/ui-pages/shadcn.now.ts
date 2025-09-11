import '@servicenow/sdk/global'
import { UiPage } from '@servicenow/sdk/core'
import htmlPage from '../../client/index.html'

UiPage({
    $id: Now.ID['shadcn-ui-kit-template'],
    endpoint: 'something.do',
    description: 'Shadcn UI Kit Template Testing',
    category: 'general',
    html: htmlPage,
    direct: true,
})