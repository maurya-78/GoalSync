import React, {
  useEffect,
  useState
} from 'react';

import {
  useParams,
  useNavigate
} from 'react-router-dom';

import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  MessageSquare,
  ShieldCheck,
  AlertTriangle,
  Activity
} from 'lucide-react';

import api from '../../services/api';

import GoalTable from '../../components/dashboard/GoalTable';

import toast from 'react-hot-toast';

export default function SubordinateReview() {

  const { sheetId } = useParams();

  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [data, setData] = useState(null);

  const [feedback, setFeedback] = useState('');

  const [loading, setLoading] =
    useState(true);

  const [reviewing, setReviewing] =
    useState(false);

  // ==========================================
  // FETCH SHEET
  // ==========================================

  useEffect(() => {

    const fetchSheet = async () => {

      try {

        setLoading(true);

        const res = await api.get(

          `/management/sheet/${sheetId}`

        );

        setData(res.data);

      } catch (error) {

        toast.error(

          error.response?.data?.message ||

          'Unable to initialize audit deck.'

        );

      } finally {

        setLoading(false);

      }

    };

    fetchSheet();

  }, [sheetId]);

  // ==========================================
  // REVIEW ACTION
  // ==========================================

  const handleReview = async (action) => {

    try {

      // ==========================================
      // VALIDATION
      // ==========================================

      if (

        action === 'Reject' &&

        feedback.trim().length < 10

      ) {

        return toast.error(

          'Managerial rejection requires detailed feedback.'

        );

      }

      setReviewing(true);

      await api.patch(

        `/management/review/${sheetId}`,

        {

          action,

          managerComments: feedback

        }

      );

      toast.success(

        `Strategic matrix ${action.toLowerCase()}ed successfully.`

      );

      navigate('/manager/dashboard');

    } catch (error) {

      toast.error(

        error.response?.data?.message ||

        'Review synchronization failed.'

      );

    } finally {

      setReviewing(false);

    }

  };

  // ==========================================
  // LOADING UI
  // ==========================================

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center">

        <div className="text-center space-y-4">

          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-black">

            Fetching Neural Audit Matrix...

          </p>

        </div>

      </div>

    );

  }

  // ==========================================
  // EMPTY STATE
  // ==========================================

  if (!data?.sheet) {

    return (

      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500">

        GoalSheet operational record unavailable.

      </div>

    );

  }

  // ==========================================
  // ANALYTICS
  // ==========================================

  const totalGoals =
    data.goals?.length || 0;

  const completedGoals =
    data.goals?.filter(

      g => g.overallProgress >= 100

    ).length || 0;

  const completionRate =
    totalGoals > 0

      ? Math.round(
          (completedGoals / totalGoals) * 100
        )

      : 0;

  // ==========================================
  // MAIN UI
  // ==========================================

  return (

    <div className="min-h-screen bg-slate-950 p-6 lg:p-8 text-slate-200 space-y-8">

      {/* ==========================================
          BACK BUTTON
      ========================================== */}

      <button

        onClick={() => navigate(-1)}

        className="flex items-center gap-2 text-xs uppercase tracking-widest font-black text-slate-500 hover:text-white transition-all"

      >

        <ArrowLeft size={16} />

        Back to Command

      </button>

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 flex flex-col xl:flex-row justify-between gap-8">

        {/* LEFT */}

        <div className="space-y-4">

          <div>

            <h1 className="text-3xl font-black italic uppercase tracking-tight text-white">

              Audit:
              <span className="text-indigo-500">
                {' '}
                {data.sheet.employee?.name}
              </span>

            </h1>

            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-black mt-2">

              Enterprise Strategic Matrix Review

            </p>

          </div>

          {/* STATUS */}

          <div className="flex items-center gap-3">

            <span className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-black border ${
              data.sheet.status === 'Approved'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : data.sheet.status === 'Rejected'
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
            }`}>

              {data.sheet.status}

            </span>

            <span className="text-xs text-slate-500">

              Operational Weightage:
              {' '}
              <span className="font-black text-indigo-400">

                {data.sheet.totalWeightage}%

              </span>

            </span>

          </div>

        </div>

        {/* RIGHT ANALYTICS */}

        <div className="grid grid-cols-2 gap-4 min-w-[320px]">

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">

            <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">

              Total Goals

            </p>

            <p className="text-3xl font-black text-white mt-2">

              {totalGoals}

            </p>

          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">

            <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">

              Completion Rate

            </p>

            <p className="text-3xl font-black text-emerald-400 mt-2">

              {completionRate}%

            </p>

          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">

            <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">

              Locked State

            </p>

            <p className="text-sm font-black text-indigo-400 mt-3 flex items-center gap-2">

              <ShieldCheck className="w-4 h-4" />

              {data.sheet.isLocked
                ? 'Locked'
                : 'Unlocked'}

            </p>

          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">

            <p className="text-[10px] uppercase tracking-widest font-black text-slate-500">

              Operational State

            </p>

            <p className="text-sm font-black text-amber-400 mt-3 flex items-center gap-2">

              <Activity className="w-4 h-4" />

              Under Review

            </p>

          </div>

        </div>

      </header>

      {/* ==========================================
          GOAL TABLE
      ========================================== */}

      <GoalTable goals={data.goals || []} />

      {/* ==========================================
          FEEDBACK
      ========================================== */}

      <div className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-8 space-y-6">

        <div className="flex items-center gap-3 text-indigo-400">

          <MessageSquare size={18} />

          <h3 className="text-xs uppercase tracking-widest font-black">

            Managerial Intelligence Feedback

          </h3>

        </div>

        <textarea

          value={feedback}

          onChange={(e) =>
            setFeedback(e.target.value)
          }

          placeholder="Strategic observations, adjustment directives, operational concerns..."

          className="w-full h-40 bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 resize-none transition-all"

        />

        {/* ACTIONS */}

        <div className="flex flex-col sm:flex-row gap-4 justify-end">

          <button

            onClick={() =>
              handleReview('Reject')
            }

            disabled={reviewing}

            className="px-8 py-4 bg-rose-600/10 border border-rose-500/20 text-rose-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"

          >

            <XCircle size={16} />

            Reject Matrix

          </button>

          <button

            onClick={() =>
              handleReview('Approve')
            }

            disabled={reviewing}

            className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 disabled:opacity-50"

          >

            <CheckCircle size={16} />

            {reviewing

              ? 'Synchronizing...'

              : 'Approve & Lock'

            }

          </button>

        </div>

      </div>

    </div>

  );

}