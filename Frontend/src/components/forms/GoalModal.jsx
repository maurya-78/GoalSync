import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  useDispatch,
  useSelector
} from 'react-redux';

import {
  X,
  Save,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';

import {
  createGoal
} from '../../redux/slices/goalSlice';

import toast from 'react-hot-toast';

export default function GoalModal({

  close,

  sheetId,

  remainingWeight

}) {

  const dispatch = useDispatch();

  const modalRef = useRef(null);

  const { isLocked } = useSelector(
    state => state.goals
  );

  // ==========================================
  // FORM STATE
  // ==========================================

  const [submitting, setSubmitting] =
    useState(false);

  const [formData, setFormData] =
    useState({

      title: '',

      description: '',

      weightage: 10,

      target: ''

    });

  // ==========================================
  // ESC CLOSE
  // ==========================================

  useEffect(() => {

    const handleEscape = (e) => {

      if (e.key === 'Escape') {

        close();

      }

    };

    window.addEventListener(
      'keydown',
      handleEscape
    );

    return () => {

      window.removeEventListener(
        'keydown',
        handleEscape
      );

    };

  }, [close]);

  // ==========================================
  // OUTSIDE CLICK CLOSE
  // ==========================================

  const handleBackdropClick = (e) => {

    if (modalRef.current === e.target) {

      close();

    }

  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const {

      name,

      value

    } = e.target;

    setFormData(prev => ({

      ...prev,

      [name]:

        name === 'weightage'

          ? Number(value)

          : value

    }));

  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    // ==========================================
    // LOCK CHECK
    // ==========================================

    if (isLocked) {

      return toast.error(
        'GoalSheet is locked.'
      );

    }

    // ==========================================
    // CAPACITY VALIDATION
    // ==========================================

    if (

      formData.weightage >

      remainingWeight

    ) {

      return toast.error(

        `Weight allocation exceeded. Remaining capacity: ${remainingWeight}%`

      );

    }

    try {

      setSubmitting(true);

      await dispatch(

        createGoal({

          ...formData,

          goalSheetId: sheetId

        })

      ).unwrap();

      toast.success(
        'Strategic vector deployed.'
      );

      // RESET FORM

      setFormData({

        title: '',

        description: '',

        weightage: 10,

        target: ''

      });

      close();

    } catch (error) {

      toast.error(

        error ||

        'Goal deployment failed.'

      );

    } finally {

      setSubmitting(false);

    }

  };

  // ==========================================
  // UI
  // ==========================================

  return (

    <div

      ref={modalRef}

      onClick={handleBackdropClick}

      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"

    >

      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in duration-300">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="flex justify-between items-start mb-8">

          <div>

            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">

              Initialize
              <span className="text-indigo-500">
                {' '}Target
              </span>

            </h2>

            <p className="text-xs uppercase tracking-widest text-slate-500 mt-2 flex items-center gap-2">

              <ShieldCheck className="w-3 h-3 text-emerald-500" />

              Strategic Vector Deployment

            </p>

          </div>

          <button

            onClick={close}

            className="text-slate-500 hover:text-white transition-all"

          >

            <X size={22} />

          </button>

        </div>

        {/* ==========================================
            REMAINING CAPACITY
        ========================================== */}

        <div className="mb-6 bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-black">

              Remaining Capacity

            </p>

            <p className="text-2xl font-black text-indigo-400 mt-1">

              {remainingWeight}%

            </p>

          </div>

          {formData.weightage >
            remainingWeight && (

            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">

              <AlertTriangle className="w-4 h-4" />

              Allocation exceeded

            </div>

          )}

        </div>

        {/* ==========================================
            FORM
        ========================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* TITLE */}

          <div className="space-y-2">

            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">

              Target Title

            </label>

            <input

              type="text"

              name="title"

              required

              value={formData.title}

              onChange={handleChange}

              placeholder="Performance Optimization"

              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500"

            />

          </div>

          {/* GRID */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* WEIGHTAGE */}

            <div className="space-y-2">

              <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">

                Weightage (%)

              </label>

              <input

                type="number"

                name="weightage"

                min={10}

                max={remainingWeight}

                required

                value={formData.weightage}

                onChange={handleChange}

                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500"

              />

            </div>

            {/* TARGET */}

            <div className="space-y-2">

              <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">

                Metric Target

              </label>

              <input

                type="text"

                name="target"

                required

                value={formData.target}

                onChange={handleChange}

                placeholder="90% SLA"

                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500"

              />

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="space-y-2">

            <label className="text-[10px] uppercase tracking-widest font-black text-slate-500">

              Strategic Context

            </label>

            <textarea

              rows={4}

              name="description"

              required

              value={formData.description}

              onChange={handleChange}

              placeholder="Detailed operational objective..."

              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 resize-none"

            />

          </div>

          {/* BUTTON */}

          <button

            type="submit"

            disabled={
              submitting ||

              isLocked
            }

            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3"

          >

            <Save size={18} />

            {submitting

              ? 'Deploying...'

              : 'Deploy Vector'

            }

          </button>

        </form>

      </div>

    </div>

  );

}