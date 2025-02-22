--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Campaigns" (
    id integer NOT NULL,
    influencer_user_id integer NOT NULL,
    retailer_id integer NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    title character varying(255),
    description text,
    commission_rate numeric(5,2),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    discount_id integer
);


ALTER TABLE public."Campaigns" OWNER TO postgres;

--
-- Name: Campaigns_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Campaigns_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Campaigns_id_seq" OWNER TO postgres;

--
-- Name: Campaigns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Campaigns_id_seq" OWNED BY public."Campaigns".id;


--
-- Name: Discounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Discounts" (
    id integer NOT NULL,
    retailer_id integer NOT NULL,
    type character varying(50) DEFAULT 'personal'::character varying NOT NULL,
    discount_percentage integer DEFAULT 0,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    base_discount integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public."Discounts" OWNER TO postgres;

--
-- Name: Discounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Discounts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Discounts_id_seq" OWNER TO postgres;

--
-- Name: Discounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Discounts_id_seq" OWNED BY public."Discounts".id;


--
-- Name: GroupDiscountParticipants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GroupDiscountParticipants" (
    id integer NOT NULL,
    group_discount_id integer NOT NULL,
    user_id integer NOT NULL,
    joined_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public."GroupDiscountParticipants" OWNER TO postgres;

--
-- Name: GroupDiscountParticipants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GroupDiscountParticipants_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GroupDiscountParticipants_id_seq" OWNER TO postgres;

--
-- Name: GroupDiscountParticipants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GroupDiscountParticipants_id_seq" OWNED BY public."GroupDiscountParticipants".id;


--
-- Name: GroupDiscounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."GroupDiscounts" (
    id integer NOT NULL,
    creator_user_id integer NOT NULL,
    retailer_id integer NOT NULL,
    title character varying(255),
    description text,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    threshold_1_participants integer DEFAULT 5,
    threshold_1_discount integer DEFAULT 10,
    threshold_2_participants integer DEFAULT 10,
    threshold_2_discount integer DEFAULT 20,
    threshold_3_participants integer DEFAULT 25,
    threshold_3_discount integer DEFAULT 25,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    discount_id integer
);


ALTER TABLE public."GroupDiscounts" OWNER TO postgres;

--
-- Name: GroupDiscounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."GroupDiscounts_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."GroupDiscounts_id_seq" OWNER TO postgres;

--
-- Name: GroupDiscounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."GroupDiscounts_id_seq" OWNED BY public."GroupDiscounts".id;


--
-- Name: Influencers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Influencers" (
    user_id integer NOT NULL,
    influencer_status character varying(50) DEFAULT 'pending_verification'::character varying NOT NULL,
    verification_requested_at timestamp with time zone,
    verification_approved_at timestamp with time zone,
    social_media_handle character varying(255),
    bio text,
    followers_count integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public."Influencers" OWNER TO postgres;

--
-- Name: Retailers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Retailers" (
    id integer NOT NULL,
    user_id integer NOT NULL,
    business_name character varying(255),
    website character varying(255),
    location character varying(255),
    verification_status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public."Retailers" OWNER TO postgres;

--
-- Name: Retailers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Retailers_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Retailers_id_seq" OWNER TO postgres;

--
-- Name: Retailers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Retailers_id_seq" OWNED BY public."Retailers".id;


--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    password_hash character varying(255) NOT NULL,
    role character varying(50) DEFAULT 'regular_user'::character varying NOT NULL,
    location character varying(255),
    date_of_birth date,
    preferences text
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Users_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Users_id_seq" OWNER TO postgres;

--
-- Name: Users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Users_id_seq" OWNED BY public."Users".id;


--
-- Name: Campaigns id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Campaigns" ALTER COLUMN id SET DEFAULT nextval('public."Campaigns_id_seq"'::regclass);


--
-- Name: Discounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Discounts" ALTER COLUMN id SET DEFAULT nextval('public."Discounts_id_seq"'::regclass);


--
-- Name: GroupDiscountParticipants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscountParticipants" ALTER COLUMN id SET DEFAULT nextval('public."GroupDiscountParticipants_id_seq"'::regclass);


--
-- Name: GroupDiscounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscounts" ALTER COLUMN id SET DEFAULT nextval('public."GroupDiscounts_id_seq"'::regclass);


--
-- Name: Retailers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Retailers" ALTER COLUMN id SET DEFAULT nextval('public."Retailers_id_seq"'::regclass);


--
-- Name: Users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users" ALTER COLUMN id SET DEFAULT nextval('public."Users_id_seq"'::regclass);


--
-- Data for Name: Campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Campaigns" (id, influencer_user_id, retailer_id, status, title, description, commission_rate, created_at, updated_at, discount_id) FROM stdin;
1	3	1	denied	Holiday Promo	Discounts for the holiday season	10.00	2025-01-19 18:51:08.671+11	2025-01-19 18:56:03.115+11	\N
2	3	2	approved	Holiday Promo	Discounts for the holiday season	10.00	2025-01-19 18:58:52.648+11	2025-01-19 19:01:03.845+11	\N
3	8	3	approved	Holiday Promo	Discounts for the holiday season	10.00	2025-01-19 19:19:49.233+11	2025-01-19 19:20:09.298+11	\N
8	3	2	pending	Summer Promo	Influencer collab for summer	15.00	2025-01-24 07:00:06.62967+11	2025-01-24 07:00:06.62967+11	2
9	16	5	denied	Australia Day Promo	Discounts for the holiday season	10.00	2025-01-26 19:48:15.592+11	2025-01-26 19:48:15.592+11	\N
10	1	5	pending	Australia Day Promo	Discounts for the holiday season	10.00	2025-01-26 19:51:50.153+11	2025-01-26 19:51:50.153+11	\N
12	2	1	pending	Holiday Promo	Discounts for the holiday season	10.00	2025-01-26 19:56:21.138+11	2025-01-26 19:56:21.139+11	\N
13	5	1	pending	Holiday Promo	Discounts for the holiday season	10.00	2025-01-26 20:16:15.459+11	2025-01-26 20:16:15.459+11	\N
14	5	1	pending	Holiday Promo	Discounts for the holiday season	10.00	2025-01-26 20:16:36.49+11	2025-01-26 20:16:36.49+11	\N
\.


--
-- Data for Name: Discounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Discounts" (id, retailer_id, type, discount_percentage, start_time, end_time, status, base_discount, created_at, updated_at) FROM stdin;
1	2	influencer_campaign	20	2025-01-24 06:49:17.01874+11	2025-01-26 06:49:17.01874+11	pending	0	2025-01-24 06:49:17.01874+11	2025-01-24 06:49:17.01874+11
2	2	influencer_campaign	20	2025-01-24 06:59:33.434583+11	2025-01-26 06:59:33.434583+11	pending	0	2025-01-24 06:59:33.434583+11	2025-01-24 06:59:33.434583+11
4	2	personal	15	2025-01-26 07:26:06.588+11	2025-01-27 07:26:06.588+11	pending	0	2025-01-26 07:26:06.588+11	2025-01-26 07:26:06.588+11
5	3	personal	15	2025-01-26 07:33:35.801+11	2025-01-27 07:33:35.801+11	active	0	2025-01-26 07:33:35.801+11	2025-01-26 07:41:18.12+11
6	1	personal	15	2025-01-26 07:50:15.924+11	2025-01-27 07:50:15.924+11	pending	0	2025-01-26 07:50:15.924+11	2025-01-26 07:50:15.924+11
7	1	personal	15	2025-01-26 07:57:09.273+11	2025-01-28 08:09:39.112+11	active	0	2025-01-26 07:57:09.273+11	2025-01-26 08:09:39.112+11
9	1	personal	15	2025-01-26 08:12:36.363+11	2025-01-27 08:12:36.363+11	pending	0	2025-01-26 08:12:36.363+11	2025-01-26 08:12:36.363+11
8	1	personal	15	2025-01-26 08:11:06.911+11	2025-01-27 08:15:17.837+11	active	0	2025-01-26 08:11:06.912+11	2025-01-26 08:15:17.837+11
10	1	group	0	2025-01-26 08:21:25.244+11	2025-02-01 10:59:59+11	pending	0	2025-01-26 08:21:25.244+11	2025-01-26 08:21:25.244+11
11	1	group	0	2025-01-26 08:30:14.489+11	2025-02-01 10:59:59+11	pending	0	2025-01-26 08:30:14.489+11	2025-01-26 08:30:14.489+11
3	2	group	0	2025-01-24 21:17:51.704438+11	2025-01-26 21:17:51.704438+11	active	0	2025-01-24 21:17:51.704438+11	2025-01-26 08:40:01.178+11
12	3	group	0	2025-01-26 09:23:58.753+11	2025-02-01 10:59:59+11	active	0	2025-01-26 09:23:58.754+11	2025-01-26 09:28:54.498+11
13	3	group	0	2025-01-26 09:57:33.878+11	2025-02-01 10:59:59+11	active	0	2025-01-26 09:57:33.879+11	2025-01-26 09:59:10.185+11
14	3	group	0	2025-01-26 10:09:37.448+11	2025-02-01 10:59:59+11	active	0	2025-01-26 10:09:37.448+11	2025-01-26 10:11:09.732+11
15	3	group	0	2025-01-26 10:23:46.839+11	2025-02-01 10:59:59+11	active	0	2025-01-26 10:23:46.839+11	2025-01-26 10:24:47.676+11
16	3	group	0	2025-01-26 10:41:30.583+11	2025-02-01 10:59:59+11	active	0	2025-01-26 10:41:30.583+11	2025-01-26 10:42:55.405+11
17	1	group	0	2025-01-26 11:19:41.728+11	2025-02-01 10:59:59+11	pending	0	2025-01-26 11:19:41.729+11	2025-01-26 11:19:41.729+11
\.


--
-- Data for Name: GroupDiscountParticipants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GroupDiscountParticipants" (id, group_discount_id, user_id, joined_at) FROM stdin;
4	1	8	2025-01-24 07:45:49.486304+11
5	1	3	2025-01-24 07:46:34.215702+11
6	1	7	2025-01-24 07:46:42.047242+11
7	1	5	2025-01-24 07:46:48.638312+11
8	1	9	2025-01-24 07:46:56.525983+11
9	1	13	2025-01-24 07:47:02.353445+11
10	2	8	2025-01-24 21:19:29.076709+11
11	9	2	2025-01-26 10:41:59.831+11
12	9	2	2025-01-26 10:43:56.437+11
13	9	3	2025-01-26 10:46:04.264+11
14	9	7	2025-01-26 10:47:04.209+11
15	9	6	2025-01-26 10:47:41.78+11
16	9	8	2025-01-26 10:48:53.423+11
17	9	8	2025-01-26 10:50:05.143+11
18	9	12	2025-01-26 10:52:42.688+11
19	10	5	2025-01-26 11:19:41.755+11
\.


--
-- Data for Name: GroupDiscounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."GroupDiscounts" (id, creator_user_id, retailer_id, title, description, status, start_time, end_time, threshold_1_participants, threshold_1_discount, threshold_2_participants, threshold_2_discount, threshold_3_participants, threshold_3_discount, created_at, updated_at, discount_id) FROM stdin;
1	7	2	Holiday Group Deal	A progressive discount for the holiday season	pending	2025-01-24 07:44:24.827675+11	2025-01-26 07:44:24.827675+11	5	10	10	20	25	25	2025-01-24 07:44:24.827675+11	2025-01-24 07:44:24.827675+11	\N
2	7	2	Holiday Group Sale	A progressive group discount for the holiday season	pending	\N	\N	5	10	10	20	25	25	2025-01-24 21:18:49.845894+11	2025-01-24 21:18:49.845894+11	3
3	6	1	Group Deal	Progressive group discount	pending	2025-01-26 08:21:25.244+11	2025-02-01 10:59:59+11	5	10	10	20	25	25	2025-01-26 08:21:25.252+11	2025-01-26 08:21:25.252+11	10
5	2	3	Group Deal	Progressive group discount	active	2025-01-26 09:23:58.753+11	2025-02-01 10:59:59+11	5	10	10	20	25	25	2025-01-26 09:23:58.779+11	2025-01-26 09:28:54.509+11	12
6	5	3	Group Deal	Progressive group discount	active	2025-01-26 09:57:33.878+11	2025-02-01 10:59:59+11	5	10	10	20	25	25	2025-01-26 09:57:33.899+11	2025-01-26 09:59:10.198+11	13
7	5	3	Group Deal	Progressive group discount	active	2025-01-26 10:09:37.448+11	2025-02-01 10:59:59+11	5	10	10	20	25	25	2025-01-26 10:09:37.47+11	2025-01-26 10:11:09.742+11	14
8	7	3	Group Deal	Progressive group discount	active	2025-01-26 10:23:46.839+11	2025-02-01 10:59:59+11	5	10	10	20	25	25	2025-01-26 10:23:46.864+11	2025-01-26 10:24:47.686+11	15
9	7	3	Group Deal	Progressive group discount	active	2025-01-26 10:41:30.583+11	2025-02-01 10:59:59+11	5	10	10	20	25	25	2025-01-26 10:41:30.603+11	2025-01-26 10:42:55.418+11	16
10	5	1	Group Deal	Progressive group discount	pending	2025-01-26 11:19:41.728+11	2025-02-01 10:59:59+11	5	10	10	20	25	25	2025-01-26 11:19:41.749+11	2025-01-26 11:19:41.749+11	17
\.


--
-- Data for Name: Influencers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Influencers" (user_id, influencer_status, verification_requested_at, verification_approved_at, social_media_handle, bio, followers_count, created_at, updated_at) FROM stdin;
3	verified	2025-01-14 06:25:31.489269+11	2025-01-14 06:26:10.58744+11	\N	\N	\N	2025-01-14 06:25:31.489269+11	2025-01-14 06:26:10.58744+11
8	verified	2025-01-17 07:23:40.39+11	2025-01-17 19:47:09.755+11	\N	\N	\N	2025-01-17 07:23:40.392+11	2025-01-17 19:47:09.756+11
6	denied	2025-01-17 19:58:44.127+11	\N	\N	\N	\N	2025-01-17 19:58:44.127+11	2025-01-17 20:01:42.896+11
16	verified	2025-01-26 18:49:40.909+11	2025-01-26 19:13:13.56+11	@myInfluencer	\N	\N	2025-01-26 18:49:40.91+11	2025-01-26 18:49:40.91+11
\.


--
-- Data for Name: Retailers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Retailers" (id, user_id, business_name, website, location, verification_status, created_at, updated_at) FROM stdin;
3	12	White Retailer	https://whiteretail.com	The Ponds	verified	2025-01-19 18:01:33.354+11	2025-01-19 18:12:51.206+11
1	11	Sally's Retail	https://sallyretail.com	Sydney	verified	2025-01-18 09:49:21.27+11	2025-01-19 18:14:11.159+11
4	13	Red Retail	https://redretail.com	Rouse Hill	pending	2025-01-19 18:39:53.1+11	2025-01-19 18:39:53.1+11
2	7	Margo's Retail	https://margoretail.com	Dee Why	denied	2025-01-18 10:56:12.57+11	2025-01-19 18:43:27.412+11
5	20	Orange Retail	https://orangeretail.com	Orewa	verified	2025-01-26 19:39:55.125+11	2025-01-26 19:39:55.125+11
\.


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20241204045817-create-users-table.js
20241204053106-create-users.js
20241206085625-create-user.js
20241206195811-create-users-table.js
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id, name, email, created_at, updated_at, password_hash, role, location, date_of_birth, preferences) FROM stdin;
1	John Doe	john.doe@example.com	2025-01-11 07:44:44.958+11	2025-01-11 07:44:44.958+11	$2b$10$8kPG2N.dlZ2yZLrE5tQmVeP47SjvQOjdB98O8D0SYQqOKMNy9nFya	regular_user	\N	\N	\N
2	Edd Perlman	eddie@example.com	2025-01-11 10:25:39.076+11	2025-01-11 10:25:39.076+11	$2b$10$dnST5rp5LQOdS46lfWkpC.GhB/1xclMSsQ3Gp9.SNra2dG.i2E.y.	regular_user	\N	\N	\N
5	Mike Perlman	mike@example.com	2025-01-11 20:38:34.761+11	2025-01-11 20:38:34.761+11	$2b$10$qU44bA7s.oF7vVeyHHFlrueqM2pTiHiyJZUOn5v62vRz4lkAUiOJ2	regular_user	\N	\N	\N
3	Marley Perlman	marley@example.com	2025-01-11 20:34:46.097+11	2025-01-11 20:34:46.097+11	$2b$10$ai00TvQEKrHeljrj4HWN1eVWT.QPmHeolVoXu.RFu7MQ9qs2ZRA1u	influencer	\N	\N	\N
9	My Admin	edyarasheff@gmail.com	2025-01-17 19:28:57.143+11	2025-01-17 19:28:57.143+11	$2b$10$PlKR6crLeYwEcY0ZwcPCku9i/3a7exsQWbblpckFXKI9hZAkenuyK	admin	\N	\N	\N
8	Alice P	alice@example.com	2025-01-17 07:02:34.097+11	2025-01-17 19:47:09.777+11	$2b$10$w6vVXCh23R9UvL0H2z/RheVWB7e.Pod9IYDTb6/7N4/l9gAbJHUzu	influencer	\N	\N	\N
10	New Admin	yarasheff@gmail.com	2025-01-17 19:48:43.139+11	2025-01-17 19:48:43.139+11	$2b$10$H6MXSF6SCeL8te5QvAILBeBmqIJ5oSB68A32b5Juf/rV71XpzRw7W	admin	\N	\N	\N
6	Olga Perlman	Olga@example.com	2025-01-12 08:45:49.791+11	2025-01-17 20:01:42.9+11	$2b$10$IZDJ7k/LJNoPbzY/szxPO.dNWzsSUK1vzv7j.tawYZlXs.FoZhHli	regular_user	\N	\N	\N
12	White Retailer	white@example.com	2025-01-19 17:59:48.218+11	2025-01-19 18:12:51.215+11	$2b$10$V3wfXRs8AdBRs57t6q/53OTA0HNSqp9Gu4mvf39w2e53Ln5sizdLy	retailer	\N	\N	\N
11	Sally Retailer	sally@example.com	2025-01-18 09:42:53.478+11	2025-01-19 18:14:11.167+11	$2b$10$zGVQ9HL4xQid1cmDfgIkiOiZuB6n31mPyMZHhH56TskDnsGnKzJcq	retailer	\N	\N	\N
7	Margo Perl	margo@example.com	2025-01-17 06:02:43.422+11	2025-01-19 18:20:49.001+11	$2b$10$BdBfhREosDyAZUPBa0dQwuNVIzcti3VrfdM8fMGkWo2OWhQ5TCIJ6	regular_user	\N	\N	\N
13	Red Red	red@example.com	2025-01-19 18:24:48.886+11	2025-01-19 18:24:48.886+11	$2b$10$7R3ZQzva2NVXLUJyzbs9g.ffjHC.eLiFFJbCp2JY3Nal4L7HqFzRS	regular_user	\N	\N	\N
14	Alice User	alice_user@example.com	2025-01-20 06:39:40.549+11	2025-01-20 06:52:46.63+11	$2b$10$nghWrZn90QHcO5eKiLe4zO6MPJxk4gxgzcIYyhSU3ux3BHL7AuKvm	regular_user	New York	1990-05-10	Loves traveling and discounts on electronics
15	Brown Shop	brown@example.com	2025-01-26 11:30:19.701+11	2025-01-26 11:30:19.701+11	$2b$10$tTucYmDg.A0EjLBwzAVbKeFw9jTbJunMCyl4iLzqmdiNjr9mWYsPC	regular_user	\N	\N	\N
18	Al Pacino	al@example.com	2025-01-26 11:33:52.924+11	2025-01-26 11:33:52.924+11	$2b$10$aSsfRAYdwc4KNh.ewf/Zm.lBI4CHBxUpTHN2GCcB5WTzg7KvVn7zW	regular_user	\N	\N	\N
19	De Niro	deniro@example.com	2025-01-26 11:34:21.414+11	2025-01-26 11:34:21.414+11	$2b$10$BXQfvVxJBgIH/4mAm9Ob0OjoBREyKOjWrwrJdUsD0wuYcPptiJOLa	regular_user	\N	\N	\N
16	Marlon Brando	marlon@example.com	2025-01-26 11:33:31.279+11	2025-01-26 11:33:31.279+11	$2b$10$ARln.0lsU4E/KmZJKyHPo.IfwHjVkHDjdPN/xxPNTh6HNjozyIqc6	influencer	\N	\N	\N
20	Orange Shop	orange@example.com	2025-01-26 19:15:03.154+11	2025-01-26 19:15:03.154+11	$2b$10$GvBoQ9mhxbfoQ7SlKh97J.0iOlsewl4YICKYzMmj4NPt03hD5/YZq	retailer	\N	\N	\N
\.


--
-- Name: Campaigns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Campaigns_id_seq"', 14, true);


--
-- Name: Discounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Discounts_id_seq"', 17, true);


--
-- Name: GroupDiscountParticipants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GroupDiscountParticipants_id_seq"', 19, true);


--
-- Name: GroupDiscounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."GroupDiscounts_id_seq"', 10, true);


--
-- Name: Retailers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Retailers_id_seq"', 5, true);


--
-- Name: Users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Users_id_seq"', 20, true);


--
-- Name: Campaigns Campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Campaigns"
    ADD CONSTRAINT "Campaigns_pkey" PRIMARY KEY (id);


--
-- Name: Discounts Discounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Discounts"
    ADD CONSTRAINT "Discounts_pkey" PRIMARY KEY (id);


--
-- Name: GroupDiscountParticipants GroupDiscountParticipants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscountParticipants"
    ADD CONSTRAINT "GroupDiscountParticipants_pkey" PRIMARY KEY (id);


--
-- Name: GroupDiscounts GroupDiscounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscounts"
    ADD CONSTRAINT "GroupDiscounts_pkey" PRIMARY KEY (id);


--
-- Name: Influencers Influencers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Influencers"
    ADD CONSTRAINT "Influencers_pkey" PRIMARY KEY (user_id);


--
-- Name: Retailers Retailers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Retailers"
    ADD CONSTRAINT "Retailers_pkey" PRIMARY KEY (id);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: Users Users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key" UNIQUE (email);


--
-- Name: Users Users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key1" UNIQUE (email);


--
-- Name: Users Users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key10" UNIQUE (email);


--
-- Name: Users Users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key11" UNIQUE (email);


--
-- Name: Users Users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key12" UNIQUE (email);


--
-- Name: Users Users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key13" UNIQUE (email);


--
-- Name: Users Users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key14" UNIQUE (email);


--
-- Name: Users Users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key15" UNIQUE (email);


--
-- Name: Users Users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key2" UNIQUE (email);


--
-- Name: Users Users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key3" UNIQUE (email);


--
-- Name: Users Users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key4" UNIQUE (email);


--
-- Name: Users Users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key5" UNIQUE (email);


--
-- Name: Users Users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key6" UNIQUE (email);


--
-- Name: Users Users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key7" UNIQUE (email);


--
-- Name: Users Users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key8" UNIQUE (email);


--
-- Name: Users Users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_email_key9" UNIQUE (email);


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (id);


--
-- Name: Campaigns Campaigns_influencer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Campaigns"
    ADD CONSTRAINT "Campaigns_influencer_user_id_fkey" FOREIGN KEY (influencer_user_id) REFERENCES public."Users"(id);


--
-- Name: Campaigns Campaigns_retailer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Campaigns"
    ADD CONSTRAINT "Campaigns_retailer_id_fkey" FOREIGN KEY (retailer_id) REFERENCES public."Retailers"(id);


--
-- Name: Influencers Influencers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Influencers"
    ADD CONSTRAINT "Influencers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: Retailers Retailers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Retailers"
    ADD CONSTRAINT "Retailers_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: Campaigns fk_campaigns_discounts; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Campaigns"
    ADD CONSTRAINT fk_campaigns_discounts FOREIGN KEY (discount_id) REFERENCES public."Discounts"(id) ON DELETE CASCADE;


--
-- Name: Campaigns fk_campaigns_influencer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Campaigns"
    ADD CONSTRAINT fk_campaigns_influencer FOREIGN KEY (influencer_user_id) REFERENCES public."Users"(id);


--
-- Name: Campaigns fk_campaigns_retailer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Campaigns"
    ADD CONSTRAINT fk_campaigns_retailer FOREIGN KEY (retailer_id) REFERENCES public."Retailers"(id);


--
-- Name: Discounts fk_discounts_retailer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Discounts"
    ADD CONSTRAINT fk_discounts_retailer FOREIGN KEY (retailer_id) REFERENCES public."Retailers"(id) ON DELETE CASCADE;


--
-- Name: Discounts fk_discounts_retailer_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Discounts"
    ADD CONSTRAINT fk_discounts_retailer_id FOREIGN KEY (retailer_id) REFERENCES public."Retailers"(id) ON DELETE CASCADE;


--
-- Name: GroupDiscountParticipants fk_gd_participants_gd; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscountParticipants"
    ADD CONSTRAINT fk_gd_participants_gd FOREIGN KEY (group_discount_id) REFERENCES public."GroupDiscounts"(id);


--
-- Name: GroupDiscountParticipants fk_gd_participants_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscountParticipants"
    ADD CONSTRAINT fk_gd_participants_user FOREIGN KEY (user_id) REFERENCES public."Users"(id);


--
-- Name: GroupDiscountParticipants fk_gdiscount_participants; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscountParticipants"
    ADD CONSTRAINT fk_gdiscount_participants FOREIGN KEY (group_discount_id) REFERENCES public."GroupDiscounts"(id) ON DELETE CASCADE;


--
-- Name: GroupDiscountParticipants fk_gdiscount_participants_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscountParticipants"
    ADD CONSTRAINT fk_gdiscount_participants_user FOREIGN KEY (user_id) REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: GroupDiscounts fk_gdiscounts_creator_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscounts"
    ADD CONSTRAINT fk_gdiscounts_creator_user FOREIGN KEY (creator_user_id) REFERENCES public."Users"(id) ON DELETE CASCADE;


--
-- Name: GroupDiscounts fk_gdiscounts_retailer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscounts"
    ADD CONSTRAINT fk_gdiscounts_retailer FOREIGN KEY (retailer_id) REFERENCES public."Retailers"(id) ON DELETE CASCADE;


--
-- Name: GroupDiscountParticipants fk_gdp_group_discount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscountParticipants"
    ADD CONSTRAINT fk_gdp_group_discount FOREIGN KEY (group_discount_id) REFERENCES public."GroupDiscounts"(id);


--
-- Name: GroupDiscountParticipants fk_gdp_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscountParticipants"
    ADD CONSTRAINT fk_gdp_user FOREIGN KEY (user_id) REFERENCES public."Users"(id);


--
-- Name: GroupDiscounts fk_group_discounts_creator; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscounts"
    ADD CONSTRAINT fk_group_discounts_creator FOREIGN KEY (creator_user_id) REFERENCES public."Users"(id);


--
-- Name: GroupDiscounts fk_group_discounts_discount; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscounts"
    ADD CONSTRAINT fk_group_discounts_discount FOREIGN KEY (discount_id) REFERENCES public."Discounts"(id) ON DELETE CASCADE;


--
-- Name: GroupDiscounts fk_group_discounts_retailer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."GroupDiscounts"
    ADD CONSTRAINT fk_group_discounts_retailer FOREIGN KEY (retailer_id) REFERENCES public."Retailers"(id);


--
-- Name: Influencers fk_influencers_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Influencers"
    ADD CONSTRAINT fk_influencers_user FOREIGN KEY (user_id) REFERENCES public."Users"(id);


--
-- Name: Retailers fk_retailers_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Retailers"
    ADD CONSTRAINT fk_retailers_user FOREIGN KEY (user_id) REFERENCES public."Users"(id);


--
-- PostgreSQL database dump complete
--

