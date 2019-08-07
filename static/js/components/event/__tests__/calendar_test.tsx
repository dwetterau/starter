import * as moment from "moment";
import * as React from "react";
import * as renderer from 'react-test-renderer';
import {CalendarComponent, CalendarView, CalendarViewType} from "../calendar";
import {mockEventFactory, mockUser} from "../../../tests/mock_models";
import {Event, EventsById, Tag, TagsById} from "../../../models";
import {API} from "../../../api";

// July 15th, 2018
const MOCK_UNIX_TIMESTAMP_MILLIS = 1531638000000;

function rendererFromView(view: CalendarView, events?: Array<Event>, tagsById?: TagsById) {
    CalendarComponent.now = function(): moment.Moment {
        return moment(MOCK_UNIX_TIMESTAMP_MILLIS)
    };
    let eventsById: EventsById = {};
    if (events != null) {
        eventsById = API.getEventsById(events)
    }
    let tagsByIdToUse: TagsById = {};
    if (tagsById != null) {
        tagsByIdToUse = tagsById
    }
    return renderer.create(
        <CalendarComponent
            meUser={mockUser()}
            eventsById={eventsById}
            tagsById={tagsByIdToUse}
            tasksById={{}}
            simpleOptions={false}
            createEvent={() => {}}
            updateEvent={() => {}}
            deleteEvent={() => {}}
            changeSelectedTag={() => {}}
            view={view}
            changeView={() => {}}
        />
    )
}

function standardView(): CalendarView {
    return {
        type: CalendarViewType.day,
        startDayTimestamp: MOCK_UNIX_TIMESTAMP_MILLIS,
        cellHeight: 50,
        initial: false,
    }
}

test('Empty Calendar App', () => {
    let view = standardView();
    view.initial = true;
    let tree = rendererFromView(view).toJSON();
    expect(tree).toMatchSnapshot("empty day view");

    // Now do the same thing with weeks
    view.type = CalendarViewType.week;
    tree = rendererFromView(view).toJSON();
    expect(tree).toMatchSnapshot("empty week view");
});

test('Basic event overlap', () => {
    const eventFactory = new mockEventFactory();
    let start = MOCK_UNIX_TIMESTAMP_MILLIS + 2 * 60 * 60 * 1000;
    let e1 = eventFactory.makeEvent(
        start,
        4 * 3600,
    );
    let e2 = eventFactory.makeEvent(
        start + (30 * 60 * 1000),
        3600,
    );
    let [columnList, eventToRenderInfo] = CalendarComponent.divideAndSort(
        standardView(),
        API.getEventsById([e1, e2]),
        null,
        {},
    );

    expect(columnList).toMatchObject([[1, 2]]);
    expect(eventToRenderInfo).toMatchObject({
        '1-0': {
            index: 0,
            height: 200,
            top: 100,
            marginLeft: 0,
            widthPercentage: 50,
        },
        '2-0': {
            index: 1,
            height: 50,
            top: 125,
            marginLeft: 50,
            widthPercentage: 50,
        }
    });

    // Now throw a third one into the mix
    let e3 = eventFactory.makeEvent(
        start + (60 * 60 * 1000),
        3600,
    );
    [columnList, eventToRenderInfo] = CalendarComponent.divideAndSort(
        standardView(),
        API.getEventsById([e1, e2, e3]),
        null,
        {},
    );

    expect(columnList).toMatchObject([[1, 2, 3]]);
    let expected = {
        '1-0': {
            index: 0,
            height: 200,
            top: 100,
            marginLeft: 0,
            widthPercentage: 33,
        },
        '2-0': {
            index: 1,
            height: 50,
            top: 125,
            marginLeft: 33,
            widthPercentage: 33,
        },
        '3-0': {
            index: 2,
            height: 50,
            top: 150,
            marginLeft: 67,
            widthPercentage: 33,
        }
    };
    expect(eventToRenderInfo).toMatchObject(expected);

    let e4 = eventFactory.makeEvent(
        start + (2 * 60 * 60 * 1000),
        3600,
    );
    [columnList, eventToRenderInfo] = CalendarComponent.divideAndSort(
        standardView(),
        API.getEventsById([e1, e2, e3, e4]),
        null,
        {},
    );

    expect(columnList).toMatchObject([[1, 2, 3, 4]]);
    expected['4-0'] =  {
        index: 1,
        height: 50,
        top: 200,
        marginLeft: 33,
        widthPercentage: 67,
    };
    expect(eventToRenderInfo).toMatchObject(expected);

    // Another type of fill-left case
    let e5 = eventFactory.makeEvent(start, 3 * 30 * 60);
    let e6 = eventFactory.makeEvent(
        start + 30 * 60 * 1000,
        3 * 30 * 60,
    );
    let e7 = eventFactory.makeEvent(
        start + 60 * 60 * 1000,
        2 * 60 * 60,
    );
    let e8 = eventFactory.makeEvent(
        start + 2 * 60 * 60 * 1000,
        60 * 60,
    );
    [columnList, eventToRenderInfo] = CalendarComponent.divideAndSort(
        standardView(),
        API.getEventsById([e5, e6, e7, e8]),
        null,
        {},
    );
    expect(columnList).toMatchObject([[5, 6, 7, 8]]);
    expect(eventToRenderInfo).toMatchObject({
        '5-0': {
            index: 0, height: 75, top: 100, marginLeft: 0, widthPercentage: 33
        },
        '6-0': {
            index: 1, height: 75, top: 125, marginLeft: 33, widthPercentage: 33
        },
        '7-0': {
            index: 2, height: 100, top: 150, marginLeft: 67, widthPercentage: 33
        },
        '8-0': {
            index: 0, height: 50, top: 200, marginLeft: 0, widthPercentage: 67
        }
    });

    // And an exceptionally simple case (two identical events)
    let e9 = eventFactory.makeEvent(start, 3 * 30 * 60);
    [columnList, eventToRenderInfo] = CalendarComponent.divideAndSort(
        standardView(),
        API.getEventsById([e5, e9]),
        null,
        {},
    );
    expect(columnList).toMatchObject([[5, 9]]);
    expect(eventToRenderInfo).toMatchObject({
        '5-0': {
            index: 0, height: 75, top: 100, marginLeft: 0, widthPercentage: 50
        },
        '9-0': {
            index: 1, top: 100, marginLeft: 50, widthPercentage: 50
        }
    });
});

test('More event overlap', () => {
    const eventFactory = new mockEventFactory();
    let start = MOCK_UNIX_TIMESTAMP_MILLIS + 2 * 60 * 60 * 1000;
    let e1 = eventFactory.makeEvent(
        start,
        2 * 3600,
    );
    let e2 = eventFactory.makeEvent(
        start + (2 * 60 * 60 * 1000),
        3600,
    );
    let e3 = eventFactory.makeEvent(
        start + (60 * 60 * 1000),
        2 * 3600,
    );
    let e4 = eventFactory.makeEvent(
        start + (2 * 60 * 60 * 1000),
        3600,
    );
    let [columnList, eventToRenderInfo] = CalendarComponent.divideAndSort(
        standardView(),
        API.getEventsById([e1, e2, e3, e4]),
        null,
        {},
    );

    expect(columnList).toMatchObject([[3, 2, 4, 1]]);
    expect(eventToRenderInfo).toMatchObject({
        '1-0': {
            index: 0,
            height: 100,
            top: 100,
            marginLeft: 0,
            widthPercentage: 33,
        },
        '2-0': {
            index: 0,
            height: 50,
            top: 200,
            marginLeft: 0,
            widthPercentage: 33,
        },
        '3-0': {
            index: 1,
            height: 100,
            top: 150,
            marginLeft: 33,
            widthPercentage: 33,
        },
        '4-0': {
            index: 2,
            height: 50,
            top: 200,
            marginLeft: 67,
            widthPercentage: 33,
        },
    });
});

test('Event overlap snapshot cases', () => {
    let start = MOCK_UNIX_TIMESTAMP_MILLIS + 2 * 60 * 60 * 1000;
    const eventFactory = new mockEventFactory();
    let e1 = eventFactory.makeEvent(start, 4 * 3600,);
    let e2 = eventFactory.makeEvent(start + (30 * 60 * 1000), 3600);
    let tree = rendererFromView(standardView(), [e1, e2]).toJSON();
    expect(tree).toMatchSnapshot("One overlapping 1 hour event");

    let e3 = eventFactory.makeEvent(start + (60 * 60 * 1000), 3600);
    let e4 = eventFactory.makeEvent(start + (2 * 60 * 60 * 1000), 3600);
    tree = rendererFromView(standardView(), [e1, e2, e3, e4]).toJSON();
    expect(tree).toMatchSnapshot("Three columns of events");

    // An exact overlap case
    let e5 = eventFactory.makeEvent(start, 4 * 3600);
    tree = rendererFromView(standardView(), [e1, e5]).toJSON();
    expect(tree).toMatchSnapshot("Two exactly-overlapping 1 hour events");
});

let tagWithChildren = (id: number, children: Array<number>, color?: string): Tag => {
    return {
        id: id,
        name: "test" + id,
        ownerId: 1,
        color: color,
        childTagIds: children,
    }
};

test('tag to parent ids', () => {
    let tagsById: TagsById = {
        1: tagWithChildren(1, [2, 3, 4]),
        2: tagWithChildren(2, [3, 4]),
        3: tagWithChildren(3, [4]),
        4: tagWithChildren(4, [5]),
        5: tagWithChildren(5, []),
        6: tagWithChildren(6, [7]),
        7: tagWithChildren(7, []),
    };

    let toParent = CalendarComponent.computeTagIdToParent(tagsById);
    expect(toParent).toEqual({
        1: [],
        2: [1],
        3: [1, 2],
        4: [1, 2, 3],
        5: [4],
        6: [],
        7: [6],
    })
});

test('Event color rendering', () => {
    let view = standardView();
    view.initial = true;
    const eventFactory = new mockEventFactory();

    let tagsById: TagsById = {
        1: tagWithChildren(1, [2], "#000"),
        2: tagWithChildren(2, [], ""),
        3: tagWithChildren(3, [], "#111"),
    };

    let e1 = eventFactory.makeEvent(MOCK_UNIX_TIMESTAMP_MILLIS, 4 * 3600, [2, 3]);
    let tree = rendererFromView(standardView(), [e1], tagsById).toJSON();
    expect(tree).toMatchSnapshot("Event with inherited color #000");

    e1 = eventFactory.makeEvent(MOCK_UNIX_TIMESTAMP_MILLIS, 4 * 3600, [3, 2]);
    tree = rendererFromView(standardView(), [e1], tagsById).toJSON();
    expect(tree).toMatchSnapshot("Event with direct color #111");

    e1 = eventFactory.makeEvent(MOCK_UNIX_TIMESTAMP_MILLIS, 4 * 3600, []);
    tree = rendererFromView(standardView(), [e1], tagsById).toJSON();
    expect(tree).toMatchSnapshot("Event with default color");
});
